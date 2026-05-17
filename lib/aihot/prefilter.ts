import type { FetchedItem } from "./fetcher";

const AI_KEYWORDS_EN = [
  /\bartificial intelligence\b/i,
  /\bmachine learning\b/i,
  /\bdeep learning\b/i,
  /\bneural network/i,
  /\bnatural language/i,
  /\bcomputer vision\b/i,
  /\blarge language model/i,
  /\bllm\b/i,
  /\bgpt\b/i,
  /\bclaude\b/i,
  /\bgemini\b/i,
  /\bopenai\b/i,
  /\banthropic\b/i,
  /\bdeepmind\b/i,
  /\bhugging face\b/i,
  /\bdiffusion\b/i,
  /\btransformer\b/i,
  /\bfine[\s-]?tun/i,
  /\brag\b/i,
  /\bagent/i,
  /\bmultimodal/i,
  /\bgenerative\b/i,
  /\bchatbot\b/i,
  /\bchatgpt\b/i,
  /\bcopilot\b/i,
  /\bsora\b/i,
  /\bdall[\s-]?e\b/i,
  /\bmidjourney\b/i,
  /\bstable diffusion\b/i,
  /\bembedding/i,
  /\btext[\s-]?to[\s-]?/i,
  /\bimage[\s-]?gen/i,
  /\bmodel\b/i,
  /\binference\b/i,
  /\btokeniz/i,
];

const AI_KEYWORDS_ZH = [
  /人工智能/,
  /机器学习/,
  /深度学习/,
  /神经网络/,
  /大模型/,
  /大语言模型/,
  /语言模型/,
  /智能体/,
  /多模态/,
  /生成式/,
  /对话/,
  /自动驾驶/,
  /自然语言/,
  /计算机视觉/,
  /知识图谱/,
  /向量/,
  /微调/,
  /推理/,
];

const ALL_PATTERNS = [...AI_KEYWORDS_EN, ...AI_KEYWORDS_ZH];

export function prefilterAI(items: FetchedItem[]): FetchedItem[] {
  return items.filter(item => {
    const text = `${item.title} ${item.clean_text || ""}`;
    return ALL_PATTERNS.some(p => p.test(text));
  });
}
