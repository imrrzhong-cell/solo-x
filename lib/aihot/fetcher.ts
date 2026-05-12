import { XMLParser } from "fast-xml-parser";
import { createHash } from "crypto";

export interface FetchedItem {
  url: string;
  url_hash: string;
  title: string;
  original_text?: string;
  clean_text?: string;
  language?: string;
  published_at?: string;
  source_id: number;
}

const MAX_AGE_DAYS = 7;

export interface FetchResult {
  source_id: number;
  source_name: string;
  items: FetchedItem[];
  success: boolean;
  error?: string;
}

function hashUrl(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}

function detectLanguage(text: string): string {
  const cjkCount = (text.match(/[一-鿿぀-ゟ゠-ヿ]/g) || []).length;
  return cjkCount > text.length * 0.1 ? "zh" : "en";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();
  } catch {
    return undefined;
  }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function parseRssFeed(xml: string, sourceId: number): FetchedItem[] {
  const parsed = parser.parse(xml);
  const items: FetchedItem[] = [];

  // Try RSS 2.0 format
  let feedItems = parsed?.rss?.channel?.item;
  // Try Atom format
  if (!feedItems) feedItems = parsed?.feed?.entry;
  // Try RSS 1.0 (RDF) format
  if (!feedItems) feedItems = parsed?.["rdf:RDF"]?.item || parsed?.RDF?.item;
  if (!feedItems) return items;

  const entries = Array.isArray(feedItems) ? feedItems : [feedItems];

  for (const entry of entries) {
    const rawLink = entry.link;
    let url = "";
    if (typeof rawLink === "string" && rawLink.startsWith("http")) {
      url = rawLink;
    } else if (typeof rawLink === "object" && rawLink?.["@_href"]) {
      url = rawLink["@_href"];
    } else if (typeof rawLink === "string" && rawLink) {
      url = rawLink;
    } else {
      url = entry?.["@_href"] || "";
    }
    const title = entry.title || "";
    if (!url || !title) continue;

    const content = entry["content:encoded"] || entry.content || entry.description || entry.summary || "";
    const contentStr = typeof content === "object" ? content["#text"] || "" : content;
    const cleanText = stripHtml(String(contentStr));

    const item: FetchedItem = {
      url,
      url_hash: hashUrl(url),
      title: typeof title === "object" ? title["#text"] || "" : String(title),
      original_text: String(contentStr).slice(0, 5000),
      clean_text: cleanText.slice(0, 2000),
      language: detectLanguage(cleanText || String(title)),
      published_at: parseDate(entry.pubDate || entry.published || entry.updated),
      source_id: sourceId,
    };

    // Skip articles older than MAX_AGE_DAYS (only if we have a confirmed old date)
    if (item.published_at) {
      const pubDate = new Date(item.published_at);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS);
      if (pubDate < cutoff) continue;
    }

    items.push(item);
  }

  return items;
}

async function fetchSource(source: { id: number; name: string; url: string; feed_type: string }): Promise<FetchResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyAIHOT/1.0; +https://solo-x.vercel.app)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { source_id: source.id, source_name: source.name, items: [], success: false, error: `HTTP ${response.status}` };
    }

    const text = await response.text();
    const trimmed = text.trim();
    if (!trimmed.startsWith("<?xml") && !trimmed.startsWith("<rss") && !trimmed.startsWith("<feed") && !trimmed.startsWith("<rdf")) {
      return { source_id: source.id, source_name: source.name, items: [], success: false, error: "Response is not XML" };
    }
    const items = parseRssFeed(text, source.id);
    return { source_id: source.id, source_name: source.name, items, success: true };
  } catch (err: any) {
    return { source_id: source.id, source_name: source.name, items: [], success: false, error: err.message };
  }
}

export async function fetchSources(
  sources: { id: number; name: string; url: string; feed_type: string }[],
  concurrency = 5
): Promise<FetchResult[]> {
  const results: FetchResult[] = [];
  const queue = [...sources];

  async function worker() {
    while (queue.length > 0) {
      const source = queue.shift();
      if (!source) break;
      const result = await fetchSource(source);
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, sources.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export { hashUrl };
