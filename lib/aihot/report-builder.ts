import { sql } from "@/lib/aihot/db";
import { callOllama } from "@/lib/ollama";

interface ReportContent {
  [category: string]: {
    id: number;
    title: string;
    score: number;
    summary: string;
    url: string;
  }[];
}

const REPORT_PROMPT = `你是一位 AI 行业分析师。基于以下今日 AI 领域精选内容，生成一份结构化的日报。

内容列表（按评分排序）：
{items}

请生成：
1. 一个标题（如"AI 日报：2024-01-15"格式）
2. 一段 200-300 字的中文综合分析（今日趋势、重点事件、行业动向）
3. 保持原有的分类结构

请返回 JSON：
{
  "title": "标题",
  "summary": "综合分析文本"
}

只返回 JSON，不要其他内容。`;

const WEEKLY_REPORT_PROMPT = `你是一位 AI 行业分析师。基于以下本周 AI 领域精选内容，生成一份结构化的周报。

内容列表（按评分排序）：
{items}

请生成：
1. 一个标题（如"AI 周报：2024-01-15 ~ 2024-01-21"格式）
2. 一段 300-500 字的中文综合分析（本周趋势、重大事件、技术突破、行业动向、下周展望）

请返回 JSON：
{
  "title": "标题",
  "summary": "综合分析文本"
}

只返回 JSON，不要其他内容。`;

async function callLLM(prompt: string, maxTokens = 1000): Promise<string> {
  return callOllama(prompt, maxTokens);
}

/**
 * Build a daily report for the given date.
 */
export async function buildDailyReport(date: string): Promise<{
  title: string;
  summary: string;
  contentJson: ReportContent;
}> {
  const items = (await sql`
    SELECT c.id, c.title, sc.translated_title, c.url, sc.score,
           sc.category, sc.summary_cn, sc.keywords, c.published_at
    FROM scored_contents sc
    JOIN contents c ON c.id = sc.content_id
    WHERE sc.is_featured = true
      AND sc.scored_at >= ${date}::date
      AND sc.scored_at < ${date}::date + INTERVAL '1 day'
    ORDER BY sc.score DESC
    LIMIT 50
  `) as any[];

  if (items.length === 0) {
    return {
      title: `AI 日报：${date}`,
      summary: "今日暂无精选内容。",
      contentJson: {},
    };
  }

  const contentJson: ReportContent = {};
  for (const item of items) {
    const cat = item.category || "other";
    if (!contentJson[cat]) contentJson[cat] = [];
    contentJson[cat].push({
      id: item.id,
      title: item.translated_title || item.title,
      score: item.score,
      summary: item.summary_cn,
      url: item.url,
    });
  }

  const itemsText = items
    .slice(0, 20)
    .map((item, i) => `[${i + 1}] ${(item.translated_title || item.title)} (评分:${item.score}) — ${item.summary_cn}`)
    .join("\n");

  try {
    const text = await callLLM(REPORT_PROMPT.replace("{items}", itemsText), 1000);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { title: parsed.title || `AI 日报：${date}`, summary: parsed.summary || "", contentJson };
    }
  } catch (err) {
    console.error("Failed to generate daily report narrative:", err);
  }

  return { title: `AI 日报：${date}`, summary: "", contentJson };
}

/**
 * Build a weekly report for the week starting on the given Monday date.
 */
export async function buildWeeklyReport(weekStart: string): Promise<{
  title: string;
  summary: string;
  contentJson: ReportContent;
}> {
  const items = (await sql`
    SELECT c.id, c.title, sc.translated_title, c.url, sc.score,
           sc.category, sc.summary_cn, sc.keywords, c.published_at
    FROM scored_contents sc
    JOIN contents c ON c.id = sc.content_id
    WHERE sc.is_featured = true
      AND sc.scored_at >= ${weekStart}::date
      AND sc.scored_at < ${weekStart}::date + INTERVAL '7 days'
    ORDER BY sc.score DESC
    LIMIT 80
  `) as any[];

  if (items.length === 0) {
    return {
      title: `AI 周报：${weekStart}`,
      summary: "本周暂无精选内容。",
      contentJson: {},
    };
  }

  const contentJson: ReportContent = {};
  for (const item of items) {
    const cat = item.category || "other";
    if (!contentJson[cat]) contentJson[cat] = [];
    contentJson[cat].push({
      id: item.id,
      title: item.translated_title || item.title,
      score: item.score,
      summary: item.summary_cn,
      url: item.url,
    });
  }

  const itemsText = items
    .slice(0, 30)
    .map((item, i) => `[${i + 1}] ${(item.translated_title || item.title)} (评分:${item.score}) — ${item.summary_cn}`)
    .join("\n");

  try {
    const text = await callLLM(WEEKLY_REPORT_PROMPT.replace("{items}", itemsText), 1500);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { title: parsed.title || `AI 周报：${weekStart}`, summary: parsed.summary || "", contentJson };
    }
  } catch (err) {
    console.error("Failed to generate weekly report narrative:", err);
  }

  return { title: `AI 周报：${weekStart}`, summary: "", contentJson };
}

/**
 * Save report to database.
 */
export async function saveReport(
  reportType: "daily" | "weekly",
  reportDate: string,
  title: string,
  summary: string,
  contentJson: ReportContent
): Promise<void> {
  await sql`
    INSERT INTO reports (report_type, report_date, title, summary, content_json)
    VALUES (${reportType}, ${reportDate}::date, ${title}, ${summary}, ${JSON.stringify(contentJson)}::jsonb)
    ON CONFLICT (report_type, report_date)
    DO UPDATE SET title = ${title}, summary = ${summary}, content_json = ${JSON.stringify(contentJson)}::jsonb
  `;
}
