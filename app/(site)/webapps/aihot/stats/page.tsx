import { sql } from "@/lib/aihot/db";
import { DbUnavailable } from "@/components/aihot/db-unavailable";

export const revalidate = 600;

async function getOverviewStats() {
  const rows = (await sql`
    SELECT
      (SELECT COUNT(*) FROM contents WHERE fetched_at >= NOW() - INTERVAL '24 hours') as contents_today,
      (SELECT COUNT(*) FROM scored_contents WHERE scored_at >= NOW() - INTERVAL '24 hours') as scored_today,
      (SELECT COUNT(*) FROM scored_contents WHERE is_featured = true) as featured_total,
      (SELECT COUNT(*) FROM sources WHERE active = true) as sources_active,
      (SELECT COUNT(*) FROM favorites) as favorites_total
  `) as any[];
  return rows[0] as Record<string, number>;
}

async function getCategoryStats() {
  const rows = await sql`
    SELECT category, COUNT(*) as count, AVG(score) as avg_score
    FROM scored_contents
    WHERE scored_at >= NOW() - INTERVAL '7 days'
    GROUP BY category
    ORDER BY count DESC
  `;
  return rows as Record<string, unknown>[];
}

async function getSourceHealth() {
  const rows = await sql`
    SELECT name, success_count, fail_count,
           CAST(success_count AS FLOAT) / NULLIF(success_count + fail_count, 0) * 100 as success_rate
    FROM sources
    WHERE active = true
    ORDER BY success_rate ASC
    LIMIT 10
  `;
  return rows as Record<string, unknown>[];
}

async function getTopKeywords(days = 7) {
  const rows = await sql`
    SELECT UNNEST(string_to_array(keywords, ',')) as keyword, COUNT(*) as count
    FROM scored_contents
    WHERE scored_at >= NOW() - INTERVAL '${days} days'
    GROUP BY keyword
    ORDER BY count DESC
    LIMIT 30
  `;
  return rows as Record<string, unknown>[];
}

export default async function StatsPage() {
  let overview: Record<string, number> | null = null;
  let categories: Record<string, unknown>[] = [];
  let sourceHealth: Record<string, unknown>[] = [];
  let keywords: Record<string, unknown>[] = [];
  let dbAvailable = true;
  try {
    [overview, categories, sourceHealth, keywords] = await Promise.all([
      getOverviewStats(),
      getCategoryStats(),
      getSourceHealth(),
      getTopKeywords(),
    ]);
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable || !overview) {
    return (
      <>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 500, color: "var(--char)" }}>
            数据统计
          </h2>
          <p style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".3rem" }}>
            系统运行指标与趋势分析
          </p>
        </div>
        <DbUnavailable />
      </>
    );
  }

  const stats = [
    {
      label: "今日抓取",
      value: overview.contents_today.toString(),
      unit: "条",
    },
    {
      label: "今日评分",
      value: overview.scored_today.toString(),
      unit: "条",
    },
    {
      label: "精选内容",
      value: overview.featured_total.toString(),
      unit: "篇",
    },
    {
      label: "活跃信源",
      value: overview.sources_active.toString(),
      unit: "个",
    },
    {
      label: "个人收藏",
      value: overview.favorites_total.toString(),
      unit: "条",
    },
  ];

  const maxKeywordCount =
    keywords.length > 0 ? (keywords[0].count as number) : 1;

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
          数据统计
        </h2>
        <p
          style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".3rem" }}
        >
          系统运行指标与趋势分析
        </p>
      </div>

      <div
        className="aihot-grid-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="aihot-stat-card">
            <div className="aihot-stat-label">{stat.label}</div>
            <div className="aihot-stat-value">
              {stat.value}
              <span style={{ fontSize: ".9rem", marginLeft: ".2rem" }}>
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="aihot-grid-2" style={{ marginBottom: "2rem" }}>
        <div className="aihot-card">
          <h3
            style={{
              fontSize: ".9rem",
              fontWeight: 500,
              color: "var(--char)",
              marginBottom: "1rem",
            }}
          >
            分类分布（近7日）
          </h3>
          {categories.map((cat: any) => (
            <div
              key={cat.category}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: ".6rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: ".82rem",
                  color: "var(--char2)",
                  textTransform: "capitalize",
                }}
              >
                {cat.category}
              </span>
              <span
                style={{
                  fontSize: ".82rem",
                  color: "var(--char)",
                  fontWeight: 500,
                }}
              >
                {cat.count} 篇
              </span>
            </div>
          ))}
        </div>

        <div className="aihot-card">
          <h3
            style={{
              fontSize: ".9rem",
              fontWeight: 500,
              color: "var(--char)",
              marginBottom: "1rem",
            }}
          >
            信源健康度（末位10）
          </h3>
          {sourceHealth.map((source: any) => (
            <div
              key={source.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: ".6rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: ".82rem",
                  color: "var(--char2)",
                  flex: 1,
                }}
              >
                {source.name}
              </span>
              <span
                style={{
                  fontSize: ".82rem",
                  color:
                    source.success_rate >= 90
                      ? "var(--sage2)"
                      : source.success_rate >= 70
                      ? "#f59e0b"
                      : "var(--error)",
                  fontWeight: 500,
                }}
              >
                {Math.round(source.success_rate)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="aihot-card">
        <h3
          style={{
            fontSize: ".9rem",
            fontWeight: 500,
            color: "var(--char)",
            marginBottom: "1rem",
          }}
        >
          热门关键词（近7日）
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
          }}
        >
          {keywords.map((kw: any) => {
            const count = kw.count as number;
            const size = 0.75 + (count / maxKeywordCount) * 0.35;
            const opacity = 0.6 + (count / maxKeywordCount) * 0.4;
            return (
              <span
                key={kw.keyword}
                style={{
                  fontSize: `${size}rem`,
                  color: `var(--sage2)`,
                  opacity,
                  padding: ".2rem .5rem",
                  background: "var(--sage4)",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                {kw.keyword} ({count})
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
