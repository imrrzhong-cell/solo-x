import { sql } from "@/lib/aihot/db";

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

/**
 * Tokenize a string into a Set of lowercase words for Jaccard comparison.
 * Handles both English (space-split) and Chinese (character-level).
 */
function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w一-鿿]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1);
  return new Set(tokens);
}

/**
 * Compute Jaccard similarity between two sets: |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

const SIMILARITY_THRESHOLD = 0.6;

/**
 * Filter out items that are duplicates of recently fetched content.
 * - URL-level: check url_hash against contents table
 * - Title-level: Jaccard similarity > threshold against recent 48h titles
 * Returns only new, non-duplicate items.
 */
export async function deduplicate(items: FetchedItem[]): Promise<FetchedItem[]> {
  if (items.length === 0) return [];

  // Step 1: URL hash dedup
  const hashes = items.map(i => i.url_hash);
  const existingRows = (await sql`
    SELECT url_hash FROM contents
    WHERE url_hash = ANY(${hashes})
  `) as any[];
  const existingHashes = new Set(existingRows.map((r: any) => r.url_hash));

  const uniqueItems = items.filter(i => !existingHashes.has(i.url_hash));

  if (uniqueItems.length === 0) return [];

  // Step 2: Title similarity dedup against recent 48h content
  const recentTitles = (await sql`
    SELECT title FROM contents
    WHERE fetched_at >= NOW() - INTERVAL '48 hours'
  `) as any[];

  const recentTokens = recentTitles.map((r: any) => tokenize(r.title));

  const result: FetchedItem[] = [];
  for (const item of uniqueItems) {
    const itemTokens = tokenize(item.title);
    let isDuplicate = false;
    for (const existingTokens of recentTokens) {
      if (jaccardSimilarity(itemTokens, existingTokens) > SIMILARITY_THRESHOLD) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      result.push(item);
    }
  }

  return result;
}
