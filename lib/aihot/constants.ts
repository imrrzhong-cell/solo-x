import type { Category } from "./types";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "model", label: "模型" },
  { key: "product", label: "产品" },
  { key: "research", label: "研究" },
  { key: "opinion", label: "观点" },
  { key: "tool", label: "工具" },
];

export function getScoreColor(score: number): string {
  if (score >= 90) return "var(--sage3)";
  if (score >= 70) return "var(--sage2)";
  if (score >= 50) return "var(--sage)";
  return "var(--char3)";
}

export const AIHOT_NAV_ITEMS = [
  { key: "featured", label: "精选", href: "/webapps/aihot/featured" },
  { key: "all", label: "全部动态", href: "/webapps/aihot/all" },
  { key: "daily", label: "日报", href: "/webapps/aihot/daily" },
  { key: "weekly", label: "周报", href: "/webapps/aihot/weekly" },
  { key: "sources", label: "信源", href: "/webapps/aihot/sources" },
  { key: "favorites", label: "收藏", href: "/webapps/aihot/favorites" },
  { key: "stats", label: "统计", href: "/webapps/aihot/stats" },
];
