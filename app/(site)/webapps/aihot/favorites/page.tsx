import { sql } from "@/lib/aihot/db";
import type { ScoredItem } from "@/lib/aihot/types";
import { ContentCard } from "@/components/aihot/content-card";
import { DbUnavailable } from "@/components/aihot/db-unavailable";

export const revalidate = 300;

async function getFavorites(tag?: string): Promise<ScoredItem[]> {
  const tagFilter = tag
    ? sql`AND f.tags ILIKE ${"%" + tag + "%"}`
    : sql``;

  const rows = await sql`
    SELECT c.id, c.url, c.title, sc.score, sc.category, sc.summary_cn,
           sc.translated_title, sc.reason, sc.keywords, sc.is_featured,
           c.published_at, s.name as source_name, s.tier as source_tier,
           f.note, f.tags, f.created_at as favorited_at
    FROM favorites f
    JOIN contents c ON c.id = f.content_id
    JOIN scored_contents sc ON sc.content_id = c.id
    JOIN sources s ON s.id = c.source_id
    WHERE 1=1 ${tagFilter}
    ORDER BY f.created_at DESC
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
    is_favorited: true,
  }));
}

async function getFavoriteTags(): Promise<string[]> {
  const rows = await sql`
    SELECT DISTINCT tags
    FROM favorites
    WHERE tags IS NOT NULL AND tags != ''
    ORDER BY tags
  `;

  const allTags = (rows as Record<string, unknown>[]).map(
    (r) => r.tags as string
  );
  const uniqueTags = new Set<string>();
  allTags.forEach((tags) => {
    tags.split(",").forEach((tag) => {
      const trimmed = tag.trim();
      if (trimmed) uniqueTags.add(trimmed);
    });
  });
  return Array.from(uniqueTags);
}

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const tag = params.tag;

  let items: ScoredItem[] = [];
  let tags: string[] = [];
  let dbAvailable = true;
  try {
    [items, tags] = await Promise.all([getFavorites(tag), getFavoriteTags()]);
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return <DbUnavailable />;
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
          收藏夹
        </h2>
        <p
          style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".3rem" }}
        >
          个人收藏的高价值内容，支持标签分类
        </p>
      </div>

      {tags.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: ".5rem" }}>
            <span
              style={{
                fontSize: ".72rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--char3)",
              }}
            >
              标签筛选
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            <a
              href="/webapps/aihot/favorites"
              className={`aihot-filter-btn ${!tag ? "active" : ""}`}
              style={{ fontSize: ".78rem" }}
            >
              全部 ({items.length})
            </a>
            {tags.map((t) => (
              <a
                key={t}
                href={`/webapps/aihot/favorites?tag=${encodeURIComponent(t)}`}
                className={`aihot-filter-btn ${tag === t ? "active" : ""}`}
                style={{ fontSize: ".78rem" }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
            background: "var(--sage4)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.1rem",
              color: "var(--char3)",
              marginBottom: ".5rem",
            }}
          >
            {tag ? `暂无标签 "${tag}" 的收藏` : "暂无收藏内容"}
          </p>
          <p style={{ fontSize: ".82rem", color: "var(--char3)" }}>
            在内容卡片上点击收藏按钮即可添加
          </p>
        </div>
      ) : (
        <div className="aihot-grid-2">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
