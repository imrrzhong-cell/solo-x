import { sql } from "@/lib/aibizradar/db";
import { fetchSources, hashUrl } from "@/lib/aihot/fetcher";
import type { FetchedItem } from "@/lib/aihot/fetcher";
import { convertRevenueToCNY } from "./constants";
import { callOllama, extractJSON } from "@/lib/ollama";

const ANALYSIS_PROMPT = `你是一个干过多个项目的连续创业者，现在做一人公司。你的客户也是一人公司主理人。
你的任务是从文章中筛选出真正适合中国一人公司干的生意机会。

严格按 JSON 格式输出，不要输出任何其他内容。

判定规则：
1. 以下情况标记 is_business_case = true：
   - 有明确产品/工具/服务，且在中国有落地可能性
   - 有商业模式（哪怕是早期的），有人愿意付费
   - 技术门槛不高，一个人或两三个人就能干
2. 以下情况标记 is_business_case = false：
   - 纯新闻、纯技术论文、行业评论
   - 在中国明显做不了（如帮美国企业做合规中介、纯海外本地生活服务）
   - 需要重资产、大量人力、特殊牌照
   - 只是概念，没有可操作的产品或服务
3. tags 必须全部用中文，如"AI工具""自动化""订阅制"等

评分标准：
- opc_fit_score（0-100）：这个生意一个人能不能干？技术门槛低不高？启动成本小不小？能不能快速验证？
- china_feasibility_score（0-100）：中国市场有没有需求？能不能落地？政策允不允许？竞争环境怎么样？
- revenue_verified：是否有明确的收入数据（如 MRR、ARR、销售额等），没有就填 false

takeaways_cn 写法要求：
- 像跟朋友聊天一样说话，不要书面语
- 说具体的，不要说空话
- 比如"这玩意国内有人在做吗？说实话不多，你可以……"这种语气
- 50-100字

每篇文章输出一个 JSON 对象：
{"is_business_case":false,"project_name":"","target_audience":"","pain_point":"","business_model":"","revenue_hint":"未提及","opc_fit_score":0,"china_feasibility_score":0,"revenue_verified":false,"takeaways_cn":"","tags":[]}

示例 true 输出：
{"is_business_case":true,"project_name":"AI简历优化工具","target_audience":"求职者和转行者","pain_point":"简历写不好，面试机会少","business_model":"按次付费，9.9元/次","revenue_hint":"月收入约2万元","opc_fit_score":88,"china_feasibility_score":92,"revenue_verified":true,"takeaways_cn":"国内求职市场巨大，简历优化这个需求太真实了。技术不复杂，套个LLM就行，关键是搞定简历模板和HR偏好数据。先从小红书引流，9.9块一单，量大出奇迹。","tags":["AI工具","求职","内容生成"]}

请只返回 JSON 数组，不要其他内容。`;

interface AnalysisResult {
  is_business_case: boolean;
  project_name: string;
  target_audience: string;
  pain_point: string;
  business_model: string;
  revenue_hint: string;
  opc_fit_score: number;
  china_feasibility_score: number;
  revenue_verified: boolean;
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
          INSERT INTO biz_opportunities (content_id, is_business_case, project_name, target_audience, pain_point, business_model, revenue_hint, opc_fit_score, china_feasibility_score, revenue_verified, takeaways_cn, tags)
          VALUES (${contentId}, true, ${a.project_name || null}, ${a.target_audience || null},
                  ${a.pain_point || null}, ${a.business_model || null}, ${revenueCNY},
                  ${a.opc_fit_score || 0}, ${a.china_feasibility_score || 0},
                  ${a.revenue_verified || false},
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
