import { sql } from "@/lib/aihot/db";
import type { ScoredItem } from "@/lib/aihot/types";
import { ContentCard } from "@/components/aihot/content-card";
import { CATEGORIES } from "@/lib/aihot/constants";
import { DbUnavailable } from "@/components/aihot/db-unavailable";

export const revalidate = 300;

async function getAllItems(
  search: string,
  category?: string,
  page = 1,
  size = 20
): Promise<ScoredItem[]> {
  const offset = (page - 1) * size;
  const categoryFilter = category
    ? sql`AND sc.category = ${category}`
    : sql``;
  const searchFilter = search
    ? sql`AND (c.title ILIKE ${"%" + search + "%"} OR sc.summary_cn ILIKE ${"%" + search + "%"})`
    : sql``;

  const rows = await sql`
    SELECT c.id, c.url, c.title, sc.score, sc.category, sc.summary_cn,
           sc.translated_title, sc.reason, sc.keywords, sc.is_featured,
           c.published_at, s.name as source_name, s.tier as source_tier
    FROM contents c
    JOIN scored_contents sc ON sc.content_id = c.id
    JOIN sources s ON s.id = c.source_id
    WHERE 1=1 ${categoryFilter} ${searchFilter}
    ORDER BY c.published_at DESC
    LIMIT ${size} OFFSET ${offset}
  `;

  return (rows as Record<string, unknown>[]).map((r) => ({
    id: r.id as number,
    url: r.url as string,
    title: r.title as string,
    translated_title: r.translated_title as string | null,
    source_name: r.source_name as string,
    source_tier: r.source_tier as string,
    score: r.score as number,
    category: r.category as ScoredItem["category"],
    summary_cn: r.summary_cn as string,
    reason: r.reason as string,
    keywords: r.keywords as string,
    published_at: r.published_at as string | null,
    is_favorited: false,
  }));
}

export default async function AllPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category as ScoredItem["category"] | undefined;
  const page = parseInt(params.page || "1");

  let items: ScoredItem[] = [];
  let dbAvailable = true;
  try {
    items = await getAllItems(search, category, page);
  } catch {
    dbAvailable = false;
  }

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
          全部动态
        </h2>
        <p
          style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".3rem" }}
        >
          按时间倒序浏览所有已评分内容
        </p>
      </div>

      {!dbAvailable ? (
        <DbUnavailable />
      ) : (
        <>
          <form method="GET" style={{ marginBottom: "1.5rem" }}>
            <input
              name="search"
              placeholder="搜索标题或摘要..."
              defaultValue={search}
              style={{
                width: "100%",
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: ".7rem 1rem",
                fontSize: ".82rem",
                color: "var(--char2)",
              }}
            />
          </form>

          <div className="aihot-filters" style={{ marginBottom: "1.5rem" }}>
            <a
              href="/webapps/aihot/all"
              className={`aihot-filter-btn ${!category ? "active" : ""}`}
            >
              全部
            </a>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.key}
                href={`/webapps/aihot/all?category=${cat.key}`}
                className={`aihot-filter-btn ${category === cat.key ? "active" : ""}`}
              >
                {cat.label}
              </a>
            ))}
          </div>

          <div className="aihot-grid-2">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>

          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--char3)" }}>
                暂无内容
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".5rem" }}>
                数据流水线启动后将自动填充
              </p>
            </div>
          )}

          {items.length === 20 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <a
                href={`/webapps/aihot/all?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${category ? `&category=${category}` : ""}`}
                style={{
                  display: "inline-block",
                  background: "var(--sage2)",
                  color: "var(--white)",
                  padding: ".6rem 1.8rem",
                  borderRadius: "var(--radius-pill)",
                  fontSize: ".78rem",
                  letterSpacing: ".1em",
                  textDecoration: "none",
                }}
              >
                加载更多
              </a>
            </div>
          )}
        </>
      )}
    </>
  );
}
