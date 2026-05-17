import type { FetchedItem } from "@/lib/aihot/fetcher";

const BIZ_KEYWORDS_EN = [
  /\brevenue\b/i,
  /\bmrr\b/i,
  /\barr\b/i,
  /\bsaas\b/i,
  /\blaunch/i,
  /\bstartup\b/i,
  /\bfreelanc/i,
  /\bside[\s-]?project/i,
  /\bindie\b/i,
  /\bbootstr[ao]p/i,
  /\bmoneti[sz]/i,
  /\bsubscri/i,
  /\bpricing\b/i,
  /\bprofit\b/i,
  /\bincome\b/i,
  /\bpaying\b/i,
  /\bcustomers?\b/i,
  /\bproduct\b/i,
  /\bbusiness\b/i,
  /\bsolo[\s-]?preneur/i,
  /\bfounder\b/i,
  /\bacqui[sr]/i,
  /\bfundraise/i,
  /\bseed[\s-]?round/i,
  /\bseries[\s-]?[abc]/i,
  /\bmarket[\s-]?fit/i,
  /\bgrowth\b/i,
];

const BIZ_KEYWORDS_ZH = [
  /变现/,
  /付费/,
  /订阅/,
  /创业/,
  /独立开发/,
  /副业/,
  /搞钱/,
  /赚钱/,
  /收入/,
  /商业模式/,
  /产品/,
  /客户/,
  /增长/,
  /融资/,
  /一人公司/,
];

const ALL_PATTERNS = [...BIZ_KEYWORDS_EN, ...BIZ_KEYWORDS_ZH] as RegExp[];

export function prefilterBiz(items: FetchedItem[]): FetchedItem[] {
  return items.filter(item => {
    const text = `${item.title} ${item.clean_text || ""}`;
    return ALL_PATTERNS.some(p => p.test(text));
  });
}
