import { sql } from "@/lib/aibizradar/db";
import { callOllama } from "@/lib/ollama";

const REPORT_PROMPT = `你是一个做过多门生意的创业者，现在经营一人公司。请总结今日抓取到的商业机会。
输出一篇 Markdown 格式的内参，口语化，像跟朋友聊天一样。

结构要求：
1. **核心趋势** — 一句话总结（如：今天独立开发者在搞 AI + 自动化方向比较多）
2. **最值得干的三件事** — 选出 opc_fit_score 最高的 3 个项目，用大白话说说为什么值得干、怎么起步
3. **避坑提醒** — 哪些方向看着好但其实不好做，为什么

以下是今日商机数据：
{items}

请输出中文 Markdown 文本，不要书面语，要说人话。`;

async function callLLM(prompt: string, maxTokens = 2000): Promise<string> {
  return callOllama(prompt, maxTokens);
}

export async function buildDailyReport(date: string): Promise<void> {
  const rows = (await sql`
    SELECT o.project_name, o.target_audience, o.pain_point, o.business_model,
           o.revenue_hint, o.opc_fit_score, o.china_feasibility_score,
           o.revenue_verified, o.takeaways_cn, o.tags, c.title, c.url
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
        `[${i + 1}] ${r.project_name || r.title} | 客群: ${r.target_audience} | 模式: ${r.business_model} | 收入: ${r.revenue_hint} | OPC适配: ${r.opc_fit_score} | 国内可行性: ${r.china_feasibility_score || '未评'} | 收入已验证: ${r.revenue_verified ? '是' : '否'} | 启示: ${r.takeaways_cn}`
    )
    .join("\n");

  const narrative = await callLLM(REPORT_PROMPT.replace("{items}", itemsText), 2000);

  const contentJson = rows.map((r: any) => ({
    project_name: r.project_name,
    target_audience: r.target_audience,
    business_model: r.business_model,
    revenue_hint: r.revenue_hint,
    opc_fit_score: r.opc_fit_score,
    china_feasibility_score: r.china_feasibility_score,
    revenue_verified: r.revenue_verified,
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
