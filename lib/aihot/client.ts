const API_BASE = "/api/aihot";

function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("aihot_api_key") || "";
}

export function setApiKey(key: string): void {
  localStorage.setItem("aihot_api_key", key);
}

export function hasApiKey(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("aihot_api_key");
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const key = getApiKey();
  if (key && ["POST", "PATCH", "DELETE"].includes(options.method || "")) {
    headers["X-API-Key"] = key;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export const api = {
  getFeatured: (page = 1, size = 20, category: string = "") =>
    fetchApi(`/feed?type=featured&page=${page}&size=${size}${category ? `&category=${category}` : ""}`),
  getAll: (page = 1, size = 20, search = "", category = "", sourceId = 0) =>
    fetchApi(`/feed?type=all&page=${page}&size=${size}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}${sourceId ? `&source_id=${sourceId}` : ""}`),
  search: (q: string) => fetchApi(`/feed/search?q=${encodeURIComponent(q)}`),
  getDaily: (date: string) => fetchApi(`/report/daily/${date}`),
  getDailyList: (limit = 30) => fetchApi(`/report/daily/list?limit=${limit}`),
  getWeekly: (date: string) => fetchApi(`/report/weekly/${date}`),
  regenerateDaily: (date: string) => fetchApi(`/report/regenerate/${date}`, { method: "POST" }),
  getSources: () => fetchApi("/sources"),
  addSource: (data: { name: string; url: string; feed_type: string; tier: string; category: string }) =>
    fetchApi("/sources", { method: "POST", body: JSON.stringify(data) }),
  updateSource: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/sources/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteSource: (id: number) => fetchApi(`/sources/${id}`, { method: "DELETE" }),
  fetchSource: (id: number) => fetchApi(`/sources/fetch/${id}`, { method: "POST" }),
  getFavorites: (tag = "", page = 1, size = 20) =>
    fetchApi(`/favorites?tag=${tag}&page=${page}&size=${size}`),
  addFavorite: (data: { content_id: number; note?: string; tags?: string }) =>
    fetchApi("/favorites", { method: "POST", body: JSON.stringify(data) }),
  updateFavorite: (id: number, data: { note?: string; tags?: string }) =>
    fetchApi(`/favorites/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteFavorite: (id: number) => fetchApi(`/favorites/${id}`, { method: "DELETE" }),
  getTags: () => fetchApi("/favorites/tags"),
  submitFeedback: (data: { content_id: number; human_score: number; note?: string }) =>
    fetchApi("/feedback", { method: "POST", body: JSON.stringify(data) }),
  getFeedbackList: () => fetchApi("/feedback/list"),
  getOverview: () => fetchApi("/stats/overview"),
  getTrends: (days = 7) => fetchApi(`/stats/trends?days=${days}`),
};
