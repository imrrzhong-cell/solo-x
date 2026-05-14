export const BIZ_NAV_ITEMS = [
  { key: "dashboard", label: "灵感大盘", href: "/webapps/aibizradar" },
  { key: "feasible", label: "高可行性", href: "/webapps/aibizradar?filter=feasible" },
  { key: "money", label: "有收入验证", href: "/webapps/aibizradar?filter=money" },
  { key: "daily", label: "每日快报", href: "/webapps/aibizradar/daily" },
];

export const BIZ_TAGS = [
  "AI 工具", "自动化服务", "订阅制", "一次性付费", "浏览器插件",
  "小程序", "内容变现", "知识付费", "数据分析", "流量套利",
  "独立开发者", "跨境出海", "效率工具", "设计工具", "写作工具",
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

export function getFeasibilityLabel(score: number | null): { text: string; color: string } {
  if (score === null) return { text: "未评", color: "var(--char3)" };
  if (score >= 80) return { text: "国内能干", color: "var(--sage2)" };
  if (score >= 60) return { text: "可以试试", color: "var(--sage)" };
  return { text: "难度较大", color: "var(--char3)" };
}

export function getRevenueHighlight(revenueHint: string | null): boolean {
  return !!revenueHint && revenueHint !== "未提及";
}
