import { sql } from "@/lib/aihot/db";
import type { FetchedItem } from "./dedupe";

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY || "";
const ZHIPU_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const SCORING_MODEL = process.env.SCORING_MODEL || "glm-4-flash";

const SCORING_PROMPT = `你是一位 AI 领域的专业内容评估师。请评估以下文章的价值。

评估标准：
1. **影响力** — 对 AI 行业的实际影响程度
2. **新颖性** — 信息的新鲜度和独特性
3. **深度** — 技术或分析的深度
4. **实用性** — 对从业者的参考价值

请对每篇文章返回 JSON 数组，每个元素包含：
- score: 0-100 的评分（整数）
- category: 必须是以下之一: "model", "product", "research", "opinion", "tool"
- summary_cn: 50-100字中文摘要
- translated_title: 中文标题（如果是英文）或原标题（如果是中文）
- reason: 10-20字评分理由
- keywords: 逗号分隔的3-5个关键词
- is_featured: boolean，score >= 65 为 true

文章列表：
{articles}

请只返回 JSON 数组，不要其他内容。`;

interface ScoreResult {
  score: number;
  category: string;
  summary_cn: string;
  translated_title: string;
  reason: string;
  keywords: string;
  is_featured: boolean;
}

const BATCH_SIZE = 5;

async function callZhipu(prompt: string, maxTokens = 2000): Promise<string> {
  const res = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ZHIPU_API_KEY}`,
    },
    body: JSON.stringify({
      model: SCORING_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Zhipu API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Score items via Zhipu GLM, then insert contents and scored_contents into DB.
 * Returns the number of items successfully saved.
 */
export async function saveScoredItems(items: FetchedItem[]): Promise<number> {
  if (items.length === 0) return 0;

  let saved = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    const articlesText = batch
      .map(
        (item, idx) =>
          `[${idx + 1}] 标题: ${item.title}\n    URL: ${item.url}\n    摘要: ${(item.clean_text || item.original_text || "").slice(0, 500)}`
      )
      .join("\n\n");

    let scores: ScoreResult[];
    try {
      const text = await callZhipu(SCORING_PROMPT.replace("{articles}", articlesText));

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error(`Scoring batch ${Math.floor(i / BATCH_SIZE) + 1}: no JSON found`);
        continue;
      }

      scores = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(`Scoring batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
      continue;
    }

    for (let j = 0; j < batch.length && j < scores.length; j++) {
      const item = batch[j];
      const s = scores[j];

      try {
        const contentRows = (await sql`
          INSERT INTO contents (source_id, url, url_hash, title, original_text, clean_text, language, published_at)
          VALUES (${item.source_id}, ${item.url}, ${item.url_hash}, ${item.title},
                  ${item.original_text || null}, ${item.clean_text || null},
                  ${item.language || null}, ${item.published_at || null})
          ON CONFLICT (url) DO NOTHING
          RETURNING id
        `) as any[];

        if (contentRows.length === 0) continue;
        const contentId = (contentRows[0] as any).id;

        await sql`
          INSERT INTO scored_contents (content_id, score, category, summary_cn, translated_title, reason, keywords, is_featured)
          VALUES (${contentId}, ${s.score}, ${s.category}, ${s.summary_cn}, ${s.translated_title}, ${s.reason}, ${s.keywords}, ${s.is_featured || s.score >= 65})
          ON CONFLICT (content_id) DO NOTHING
        `;
        saved++;
      } catch (err) {
        console.error(`Failed to save item ${item.url}:`, err);
      }
    }
  }

  return saved;
}
