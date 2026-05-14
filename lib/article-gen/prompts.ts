const AIHOT_SYSTEM = `你是一位资深 AI 行业分析师，同时兼具科技媒体主编的叙事能力。
你的读者是有技术背景的独立创作者和一人公司主理人，他们关心：
- 哪些技术突破可以变成产品
- 哪些行业变化会带来新机会
- 作为一人公司，现在应该关注什么、学习什么、投入什么

你的写作风格：专业但不晦涩，像给内行朋友写一封深度分析邮件。引用具体数据，不写空洞总结。`;

const AIHOT_SECTION_1 = `请撰写本文的前半部分：

1. 首先写"## 今日概览"（200-300字），概述今日 AI 领域最重要的 2-3 个趋势
2. 然后对前 5 条新闻逐一深度解读（每条 200-300 字），每条必须包含：
   - **事件背景**：发生了什么
   - **核心影响**：为什么重要
   - **行业判断**：会带来什么变化
   - **行动建议**：独立创作者可以做什么

新闻格式：## N. {标题} 然后正文，不要加粗标题。

请输出 Markdown 格式正文，不要输出 JSON，不要重复新闻原文。`;

const AIHOT_SECTION_2 = (part1: string) => `以下是前半部分已生成的内容：

${part1.slice(-1500)}

请继续撰写后半部分：

1. 对剩余的新闻（第 6 条起）逐一深度解读（每条 200-300 字），格式与前半部分一致
2. 最后写"## 趋势洞察"（200-300字），总结今日趋势并展望短期方向
3. 末尾加一行：---
4. 再加一行：*本文基于 {N} 个信源，由 Ollama + Qwen 2.5 自动生成*

保持与前半部分的连贯性，不要重复已写内容。

请输出 Markdown 格式正文，不要输出 JSON。`;

export function buildAihotPrompts(items: { title: string; score: number; category: string; summary: string; url: string }[]): { p1: string; p2: (part1: string) => string } {
  const itemsText = items
    .map((item, i) => `[${i + 1}] ${item.title} | 评分:${item.score} | 分类:${item.category} | 摘要:${item.summary}`)
    .join("\n");

  const p1 = `${AIHOT_SYSTEM}\n\n${AIHOT_SECTION_1}\n\n今日 Top ${items.length} AI 新闻（按评分排序）：\n${itemsText}`;

  return { p1, p2: AIHOT_SECTION_2 };
}

const BIZ_SYSTEM = `你是一位连续创业者兼天使投资人，在中国和美国市场都有深度参与。
你有 10 年电商和产业互联网经验，现在经营一家一人公司。
你的读者是同样背景的创业者，他们需要的是：
- 这个生意能不能做
- 怎么做，第一步是什么
- 在中国市场上需要什么改造
- 预计投入多少，多久能见回报

你的写作风格：像创业老兵和徒弟喝茶聊天，务实、直白、有洞察。必须结合中国市场实际情况分析。`;

const BIZ_SECTION_1 = `请撰写本文的前半部分：

1. 首先写"## 市场温度"（200-300字），概述当日全球独立开发者商业环境
2. 然后对前一半的商业机会逐一分析（每个 200-300 字），必须包含五个维度：
   - **商业拆解**：怎么赚钱，边际成本在哪
   - **客群画像**：谁在买单，付费意愿如何
   - **竞争壁垒**：护城河在哪，能撑多久
   - **国内适配**：中国市场能否复制，需要做什么改造
   - **行动建议**：第一步做什么，预计投入和周期

格式：## 生意机会 N：{项目名称} 然后正文。

请输出 Markdown 格式正文，不要输出 JSON，不要重复原始数据。`;

const BIZ_SECTION_2 = (part1: string) => `以下是前半部分已生成的内容：

${part1.slice(-1500)}

请继续撰写后半部分：

1. 对剩余的商业机会逐一分析，格式与前半部分一致
2. 最后写"## 今日操盘建议"（200-300字），总结哪些方向最值得投入，需要避开什么
3. 末尾加一行：---
4. 再加一行：*本文基于 {N} 个商业案例，由 Ollama + Qwen 2.5 自动生成*

保持与前半部分的连贯性，不要重复已写内容。

请输出 Markdown 格式正文，不要输出 JSON。`;

export function buildBizPrompts(items: { project_name: string; business_model: string; revenue_hint: string; target_audience: string; opc_fit_score: number; ecommerce_relevance_score: number; takeaways_cn: string; url: string }[]): { p1: string; p2: (part1: string) => string } {
  const itemsText = items
    .map((item, i) => `[${i + 1}] ${item.project_name} | 模式:${item.business_model} | 收入:${item.revenue_hint} | 客群:${item.target_audience} | OPC适配:${item.opc_fit_score} | 电商相关:${item.ecommerce_relevance_score} | 启示:${item.takeaways_cn}`)
    .join("\n");

  const p1 = `${BIZ_SYSTEM}\n\n${BIZ_SECTION_1}\n\n今日发现的商业机会：\n${itemsText}`;

  return { p1, p2: BIZ_SECTION_2 };
}
