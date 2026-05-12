import { sql } from "@/lib/aihot/db";
import type { Source } from "@/lib/aihot/types";

export const revalidate = 600;

async function getSources(): Promise<Source[]> {
  const rows = await sql`
    SELECT id, name, url, feed_type, tier, category, active,
           fetch_interval_minutes, last_fetched_at, success_count, fail_count, created_at
    FROM sources
    ORDER BY tier ASC, name ASC
  `;

  return (rows as Record<string, unknown>[]).map((r) => ({
    id: r.id as number,
    name: r.name as string,
    url: r.url as string,
    feed_type: r.feed_type as "rss" | "html",
    tier: r.tier as "T1" | "T2",
    category: r.category as string,
    active: r.active as boolean,
    fetch_interval_minutes: r.fetch_interval_minutes as number,
    last_fetched_at: r.last_fetched_at as string | null,
    success_count: r.success_count as number,
    fail_count: r.fail_count as number,
    created_at: r.created_at as string,
  }));
}

function getSuccessRate(success: number, fail: number): number {
  const total = success + fail;
  if (total === 0) return 100;
  return Math.round((success / total) * 100);
}

function formatLastFetched(dateStr: string | null): string {
  if (!dateStr) return "从未";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}分钟前`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
}

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            fontWeight: 500,
            color: "var(--char)",
          }}
        >
          信源管理
        </h2>
        <p
          style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".3rem" }}
        >
          管理 25+ AI 领域信源，监控抓取健康状态
        </p>
      </div>

      <div className="aihot-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="aihot-table">
          <thead>
            <tr>
              <th>信源</th>
              <th>类型</th>
              <th>分级</th>
              <th>分类</th>
              <th>状态</th>
              <th>抓取频率</th>
              <th>最后抓取</th>
              <th>成功率</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => {
              const successRate = getSuccessRate(
                source.success_count,
                source.fail_count
              );
              return (
                <tr key={source.id}>
                  <td>
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontWeight: 500,
                        color: "var(--char)",
                      }}
                    >
                      {source.name}
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: ".7rem",
                        color: "var(--char3)",
                        textDecoration: "none",
                      }}
                    >
                      {source.url.replace(/^https?:\/\//, "").split("/")[0]}
                    </a>
                  </td>
                  <td>
                    <span
                      className={`aihot-badge ${
                        source.feed_type === "rss" ? "aihot-badge-sage" : ""
                      }`}
                    >
                      {source.feed_type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`aihot-badge ${
                        source.tier === "T1" ? "aihot-badge-gold" : ""
                      }`}
                    >
                      {source.tier}
                    </span>
                  </td>
                  <td style={{ fontSize: ".82rem", color: "var(--char2)" }}>
                    {source.category}
                  </td>
                  <td>
                    <div
                      className={`aihot-toggle ${
                        source.active ? "active" : ""
                      }`}
                      style={{ pointerEvents: "none" }}
                    >
                      <div className="aihot-toggle-slider" />
                    </div>
                  </td>
                  <td style={{ fontSize: ".82rem", color: "var(--char2)" }}>
                    {source.fetch_interval_minutes}分钟
                  </td>
                  <td style={{ fontSize: ".82rem", color: "var(--char2)" }}>
                    {formatLastFetched(source.last_fetched_at)}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: ".82rem",
                        color:
                          successRate >= 90
                            ? "var(--sage2)"
                            : successRate >= 70
                            ? "#f59e0b"
                            : "var(--error)",
                        fontWeight: 500,
                      }}
                    >
                      {successRate}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "var(--sage4)",
          borderRadius: "var(--radius-card)",
          fontSize: ".78rem",
          color: "var(--char2)",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>提示：</strong>
          T1 信源为高质量核心源，T2 为补充源。RSS 源更新频率较高，
          HTML 源需解析页面内容。成功率低于 70% 的信源可能需要检查配置。
        </p>
      </div>
    </>
  );
}
