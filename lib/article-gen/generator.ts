import { sql } from "@/lib/article-gen/db";
import { callOllama } from "@/lib/ollama";
import { buildAihotPrompts, buildBizPrompts } from "./prompts";
import type { ArticleType, GeneratedArticle, ArticleCard, TopItem } from "./types";

const SECTION_TOKENS = 6000;

async function generateArticle(title: string, p1: string, p2Builder: (part1: string) => string, sourceCount: number): Promise<string> {
  console.log(`[article-gen] Generating part 1 for: ${title}`);
  const part1 = await callOllama(p1, SECTION_TOKENS);
  if (!part1.trim()) throw new Error("Part 1 generation returned empty");

  console.log(`[article-gen] Part 1 done (${part1.length} chars), generating part 2...`);
  const p2 = p2Builder(part1);
  const part2 = await callOllama(p2, SECTION_TOKENS);
  if (!part2.trim()) throw new Error("Part 2 generation returned empty");

  return `${part1.trim()}\n\n${part2.trim()}`;
}

function extractTitle(contentMd: string, fallback: string): string {
  const m = contentMd.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

function extractSummary(contentMd: string): string {
  const overview = contentMd.match(/##\s+(?:今日概览|市场温度)\s*\n+([\s\S]{50,300}?)(?=\n##|\n---)/);
  if (overview) return overview[1].replace(/\n/g, " ").trim().slice(0, 200);
  return contentMd.replace(/[#*_\n]/g, " ").trim().slice(0, 200);
}

export async function generateAihotDeepRead(date: string): Promise<GeneratedArticle> {
  const items = (await sql`
    SELECT c.title, c.url, sc.score, sc.category, sc.summary_cn, sc.translated_title
    FROM scored_contents sc
    JOIN contents c ON c.id = sc.content_id
    WHERE sc.is_featured = true
      AND sc.scored_at >= ${date}::date
      AND sc.scored_at < ${date}::date + INTERVAL '1 day'
    ORDER BY sc.score DESC
    LIMIT 10
  `) as any[];

  if (items.length === 0) throw new Error(`No featured items found for ${date}`);

  const formatted = items.map((r: any) => ({
    title: r.translated_title || r.title,
    score: r.score,
    category: r.category,
    summary: r.summary_cn || "",
    url: r.url,
  }));

  const { p1, p2 } = buildAihotPrompts(formatted);
  const contentMd = await generateArticle(
    `AI 热点深度解读：${date}`,
    p1,
    p2,
    formatted.length,
  );

  const title = extractTitle(contentMd, `AI 热点深度解读：${date}`);
  const summary = extractSummary(contentMd);
  const topItems: TopItem[] = formatted.slice(0, 5).map(i => ({ title: i.title, url: i.url, score: i.score }));

  const rows = (await sql`
    INSERT INTO generated_articles (article_type, article_date, title, summary, content_md, source_count, top_items)
    VALUES ('aihot_deep_read', ${date}::date, ${title}, ${summary}, ${contentMd}, ${formatted.length}, ${JSON.stringify(topItems)}::jsonb)
    ON CONFLICT (article_type, article_date)
    DO UPDATE SET title = ${title}, summary = ${summary}, content_md = ${contentMd}, source_count = ${formatted.length}, top_items = ${JSON.stringify(topItems)}::jsonb
    RETURNING *
  `) as any[];

  return rows[0] as GeneratedArticle;
}

export async function generateBizradarBizInsight(date: string): Promise<GeneratedArticle> {
  const items = (await sql`
    SELECT o.project_name, o.target_audience, o.pain_point, o.business_model,
           o.revenue_hint, o.opc_fit_score, o.ecommerce_relevance_score,
           o.takeaways_cn, o.tags, c.title, c.url
    FROM biz_opportunities o
    JOIN biz_contents c ON o.content_id = c.id
    WHERE o.is_business_case = true
      AND o.analyzed_at >= ${date}::date
      AND o.analyzed_at < (${date}::date + INTERVAL '1 day')
    ORDER BY o.opc_fit_score DESC
    LIMIT 10
  `) as any[];

  if (items.length === 0) throw new Error(`No business cases found for ${date}`);

  const formatted = items.map((r: any) => ({
    project_name: r.project_name || r.title,
    business_model: r.business_model || "未明确",
    revenue_hint: r.revenue_hint || "未提及",
    target_audience: r.target_audience || "未明确",
    opc_fit_score: r.opc_fit_score || 0,
    china_feasibility_score: r.china_feasibility_score || 0,
    revenue_verified: r.revenue_verified || false,
    takeaways_cn: r.takeaways_cn || "",
    url: r.url,
  }));

  const { p1, p2 } = buildBizPrompts(formatted);
  const contentMd = await generateArticle(
    `搞钱雷达·生意经：${date}`,
    p1,
    p2,
    formatted.length,
  );

  const title = extractTitle(contentMd, `搞钱雷达·生意经：${date}`);
  const summary = extractSummary(contentMd);
  const topItems: TopItem[] = formatted.slice(0, 5).map(i => ({ title: i.project_name, url: i.url, score: i.opc_fit_score }));

  const rows = (await sql`
    INSERT INTO generated_articles (article_type, article_date, title, summary, content_md, source_count, top_items)
    VALUES ('bizradar_biz_insight', ${date}::date, ${title}, ${summary}, ${contentMd}, ${formatted.length}, ${JSON.stringify(topItems)}::jsonb)
    ON CONFLICT (article_type, article_date)
    DO UPDATE SET title = ${title}, summary = ${summary}, content_md = ${contentMd}, source_count = ${formatted.length}, top_items = ${JSON.stringify(topItems)}::jsonb
    RETURNING *
  `) as any[];

  return rows[0] as GeneratedArticle;
}

export async function getLatestArticles(limit = 10): Promise<ArticleCard[]> {
  const rows = (await sql`
    SELECT id, article_type, article_date, title, summary, source_count
    FROM generated_articles
    WHERE status = 'published'
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as any[];
  return rows as ArticleCard[];
}

export async function getArticleByTypeAndDate(type: ArticleType, date: string): Promise<GeneratedArticle | null> {
  const rows = (await sql`
    SELECT * FROM generated_articles
    WHERE article_type = ${type} AND article_date = ${date}::date AND status = 'published'
  `) as any[];
  return rows.length > 0 ? (rows[0] as GeneratedArticle) : null;
}

export async function getAdjacentDates(type: ArticleType, date: string): Promise<{ prev: string | null; next: string | null }> {
  const [prevRows, nextRows] = await Promise.all([
    sql`SELECT article_date FROM generated_articles WHERE article_type = ${type} AND article_date < ${date}::date AND status = 'published' ORDER BY article_date DESC LIMIT 1`,
    sql`SELECT article_date FROM generated_articles WHERE article_type = ${type} AND article_date > ${date}::date AND status = 'published' ORDER BY article_date ASC LIMIT 1`,
  ]) as [any[], any[]];

  return {
    prev: prevRows.length > 0 ? prevRows[0].article_date.toISOString().slice(0, 10) : null,
    next: nextRows.length > 0 ? nextRows[0].article_date.toISOString().slice(0, 10) : null,
  };
}
