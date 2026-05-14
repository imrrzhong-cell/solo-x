import { sql } from "@/lib/aibizradar/db";
import { callOllama } from "@/lib/ollama";

const REPORT_PROMPT = `作为首席商业情报官，请总结今日抓取到的 Top 15 个高适配度 AI 商业情报。
输出一篇 Markdown 格式的《AI 搞钱内参》。

结构要求：
1. **核心趋势** — 一句话总结（如：今天独立开发者的重点在于 AI 解决 SEO 自动化）。
2. **电商/产业红利** — 选出 ecommerce_relevance_score 最高的 1-2 个项目深度点评。
3. **最佳搞钱模型** — 选出带有明确收入，且 OPC 适配度最高的项目，阐述为什么可以复刻它。

以下是今日商机数据：
{items}

请输出中文 Markdown 文本。`;

async function callLLM(prompt: string, maxTokens = 2000): Promise<string> {
  return callOllama(prompt, maxTokens);
}

export async function buildDailyReport(date: string): Promise<void> {
  const rows = (await sql`
    SELECT o.project_name, o.target_audience, o.pain_point, o.business_model,
           o.revenue_hint, o.opc_fit_score, o.ecommerce_relevance_score,
           o.takeaways_cn, o.tags, c.title, c.url
    FROM biz_opportunities o
    JOIN biz_contents c ON o.content_id = c.id
    WHERE o.is_business_case = true
      AND o.analyzed_at >= ${date}::date
      AND o.analyzed_at < (${date}::date + INTERVAL '1 day')
    ORDER BY o.opc_fit_score DESC
    LIMIT 15
  `) as any[];

  if (rows.length === 0) return;

  const itemsText = rows
    .map(
      (r: any, i: number) =>
        `[${i + 1}] ${r.project_name || r.title} | 客群: ${r.target_audience} | 模式: ${r.business_model} | 收入: ${r.revenue_hint} | OPC适配度: ${r.opc_fit_score} | 电商相关度: ${r.ecommerce_relevance_score}`
    )
    .join("\n");

  const narrative = await callLLM(REPORT_PROMPT.replace("{items}", itemsText), 2000);

  const contentJson = rows.map((r: any) => ({
    project_name: r.project_name,
    target_audience: r.target_audience,
    business_model: r.business_model,
    revenue_hint: r.revenue_hint,
    opc_fit_score: r.opc_fit_score,
    ecommerce_relevance_score: r.ecommerce_relevance_score,
    takeaways_cn: r.takeaways_cn,
    url: r.url,
  }));

  await sql`
    INSERT INTO biz_reports (report_type, report_date, narrative, content_json)
    VALUES ('daily', ${date}::date, ${narrative}, ${JSON.stringify(contentJson)}::jsonb)
    ON CONFLICT (report_type, report_date)
    DO UPDATE SET narrative = ${narrative}, content_json = ${JSON.stringify(contentJson)}::jsonb
  `;
}
