import { sql } from "@/lib/aibizradar/db";
import { fetchSources, hashUrl } from "@/lib/aihot/fetcher";
import type { FetchedItem } from "@/lib/aihot/fetcher";
import { convertRevenueToCNY } from "./constants";
import { callOllama, extractJSON } from "@/lib/ollama";

const ANALYSIS_PROMPT = `你是商业情报分析师。从文章中提取商业价值情报，严格按 JSON 格式输出。

规则：
- 产品/工具/服务发布 = is_business_case: true（即使无收入数据）
- 纯新闻/纯技术论文 = is_business_case: false
- 注意：Product Hunt 等平台的产品发布通常包含商业模式，应标记为 true

每篇文章输出一个 JSON 对象，必须包含以下字段：
{"is_business_case":false,"project_name":"","target_audience":"","pain_point":"","business_model":"","revenue_hint":"未提及","opc_fit_score":0,"ecommerce_relevance_score":0,"takeaways_cn":"","tags":[]}

重要：opc_fit_score 和 ecommerce_relevance_score 范围是 0-100（百分比），不是 0-10！

示例 true 输出：
{"is_business_case":true,"project_name":"AI Logo Maker","target_audience":"独立开发者和小企业","pain_point":"专业 logo 设计成本高","business_model":"SaaS 订阅制","revenue_hint":"$5K MRR","opc_fit_score":85,"ecommerce_relevance_score":70,"takeaways_cn":"AI 生成 logo 的 SaaS 模式适合 OPC 复刻，技术门槛低，可针对中国电商卖家做本土化版本","tags":["SaaS","设计工具","AI自动化"]}

请只返回 JSON 数组，不要其他内容。`;

interface AnalysisResult {
  is_business_case: boolean;
  project_name: string;
  target_audience: string;
  pain_point: string;
  business_model: string;
  revenue_hint: string;
  opc_fit_score: number;
  ecommerce_relevance_score: number;
  takeaways_cn: string;
  tags: string[];
}

const BATCH_SIZE = 3;

async function callLLM(prompt: string, maxTokens = 2000): Promise<string> {
  return callOllama(prompt, maxTokens);
}

function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w一-鿿]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 1);
  return new Set(tokens);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

async function bizDeduplicate(items: FetchedItem[]): Promise<FetchedItem[]> {
  if (items.length === 0) return [];

  const hashes = items.map(i => i.url_hash);
  const existingRows = (await sql`
    SELECT url_hash FROM biz_contents
    WHERE url_hash = ANY(${hashes})
  `) as any[];
  const existingHashes = new Set(existingRows.map((r: any) => r.url_hash));

  const uniqueItems = items.filter(i => !existingHashes.has(i.url_hash));
  if (uniqueItems.length === 0) return [];

  const recentTitles = (await sql`
    SELECT title FROM biz_contents
    WHERE created_at >= NOW() - INTERVAL '48 hours'
  `) as any[];

  const recentTokens = recentTitles.map((r: any) => tokenize(r.title));

  const result: FetchedItem[] = [];
  for (const item of uniqueItems) {
    const itemTokens = tokenize(item.title);
    let isDuplicate = false;
    for (const existingTokens of recentTokens) {
      if (jaccardSimilarity(itemTokens, existingTokens) > 0.6) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) result.push(item);
  }

  return result;
}

export async function saveAnalyzedItems(items: FetchedItem[]): Promise<number> {
  if (items.length === 0) return 0;

  let saved = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    const articlesText = batch
      .map(
        (item, idx) =>
          `[${idx + 1}] 标题: ${item.title}\n    URL: ${item.url}\n    摘要: ${(item.clean_text || item.original_text || "").slice(0, 3000)}`
      )
      .join("\n\n");

    let analyses: AnalysisResult[];
    try {
      const text = await callLLM(`${ANALYSIS_PROMPT}\n\n文章列表：\n${articlesText}`);
      const parsed = extractJSON(text);
      if (!parsed) {
        console.error(`Analysis batch ${Math.floor(i / BATCH_SIZE) + 1}: no JSON found`);
        console.error("LLM output:", text.slice(0, 200));
        continue;
      }
      analyses = parsed;
    } catch (err) {
      console.error(`Analysis batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
      continue;
    }

    for (let j = 0; j < batch.length && j < analyses.length; j++) {
      const item = batch[j];
      const a = analyses[j];

      if (!a.is_business_case) continue;

      try {
        const contentRows = (await sql`
          INSERT INTO biz_contents (source_id, url, url_hash, title, original_text, clean_text, language, published_at)
          VALUES (${item.source_id}, ${item.url}, ${item.url_hash}, ${item.title},
                  ${item.original_text || null}, ${item.clean_text || null},
                  ${item.language || null}, ${item.published_at || null})
          ON CONFLICT (url) DO NOTHING
          RETURNING id
        `) as any[];

        if (contentRows.length === 0) continue;
        const contentId = (contentRows[0] as any).id;

        const revenueCNY = convertRevenueToCNY(a.revenue_hint || "未提及");

        await sql`
          INSERT INTO biz_opportunities (content_id, is_business_case, project_name, target_audience, pain_point, business_model, revenue_hint, opc_fit_score, ecommerce_relevance_score, takeaways_cn, tags)
          VALUES (${contentId}, true, ${a.project_name || null}, ${a.target_audience || null},
                  ${a.pain_point || null}, ${a.business_model || null}, ${revenueCNY},
                  ${a.opc_fit_score || 0}, ${a.ecommerce_relevance_score || 0},
                  ${a.takeaways_cn || null}, ${a.tags || []})
          ON CONFLICT (content_id) DO NOTHING
        `;
        saved++;
      } catch (err) {
        console.error(`Failed to save biz item ${item.url}:`, err);
      }
    }
  }

  return saved;
}

export { fetchSources, hashUrl, bizDeduplicate };
