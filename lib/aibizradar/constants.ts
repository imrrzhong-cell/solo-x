export const BIZ_NAV_ITEMS = [
  { key: "dashboard", label: "灵感大盘", href: "/webapps/aibizradar" },
  { key: "ecommerce", label: "电商专属", href: "/webapps/aibizradar?filter=ecommerce" },
  { key: "money", label: "有收入验证", href: "/webapps/aibizradar?filter=money" },
  { key: "daily", label: "每日快报", href: "/webapps/aibizradar/daily" },
];

export const BIZ_TAGS = [
  "B2B SaaS", "流量套利", "跨境出海", "API 套壳", "浏览器插件",
  "AI 自动化", "内容营销", "代运营服务", "买断制", "订阅制",
  "独立开发者", "电商工具", "SEO 工具", "数据分析", "PLG 增长",
];

export const USD_TO_CNY = 7.25;

export function convertRevenueToCNY(revenueHint: string): string {
  if (!revenueHint || revenueHint === "未提及") return revenueHint;

  let converted = revenueHint;

  converted = converted.replace(/\$(\d+(?:,\d+)*(?:\.\d+)?)\s*K/i, (_, num) => {
    const amount = parseFloat(num.replace(/,/g, "")) * 1000 * USD_TO_CNY;
    return `¥${Math.round(amount).toLocaleString("zh-CN")}`;
  });

  converted = converted.replace(/\$(\d+(?:,\d+)*(?:\.\d+)?)\s*M/i, (_, num) => {
    const amount = parseFloat(num.replace(/,/g, "")) * 1000000 * USD_TO_CNY;
    return `¥${Math.round(amount).toLocaleString("zh-CN")}`;
  });

  converted = converted.replace(/\$(\d+(?:,\d+)*(?:\.\d+)?)/g, (_, num) => {
    const amount = parseFloat(num.replace(/,/g, "")) * USD_TO_CNY;
    return `¥${Math.round(amount).toLocaleString("zh-CN")}`;
  });

  return converted;
}

export function getScoreLabel(score: number | null): { text: string; color: string } {
  if (score === null) return { text: "未评", color: "var(--char3)" };
  if (score >= 80) return { text: "极度适配", color: "var(--sage2)" };
  if (score >= 60) return { text: "值得尝试", color: "var(--sage)" };
  return { text: "参考即可", color: "var(--char3)" };
}

export function getRevenueHighlight(revenueHint: string | null): boolean {
  return !!revenueHint && revenueHint !== "未提及";
}
