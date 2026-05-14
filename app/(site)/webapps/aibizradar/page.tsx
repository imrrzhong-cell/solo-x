import { sql, ensureBizSchema } from "@/lib/aibizradar/db";
import type { OpportunityCard, FilterType } from "@/lib/aibizradar/types";
import { BizCard } from "@/components/aibizradar/biz-card";
import { Suspense } from "react";
import { BizLoadingSkeleton } from "@/components/aibizradar/loading-skeleton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "": { title: "灵感大盘", desc: "最近识别到的 AI 商业机会" },
  ecommerce: { title: "电商专属", desc: "电商/产业互联网高相关度的商业情报" },
  money: { title: "有收入验证", desc: "带有明确收入数据的实赚案例" },
};

async function fetchOpportunities(filter: FilterType, page: number) {
  try {
    await ensureBizSchema();

    if (filter === "ecommerce") {
      const rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true AND o.ecommerce_relevance_score > 70
        ORDER BY o.analyzed_at DESC
        LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
      `) as any[];
      const countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities
        WHERE is_business_case = true AND ecommerce_relevance_score > 70
      `) as any[];
      return { items: rows as OpportunityCard[], total: parseInt(countRows[0]?.cnt || "0") };
    }

    if (filter === "money") {
      const rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true AND o.revenue_hint IS NOT NULL AND o.revenue_hint != '未提及'
        ORDER BY o.analyzed_at DESC
        LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
      `) as any[];
      const countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities
        WHERE is_business_case = true AND revenue_hint IS NOT NULL AND revenue_hint != '未提及'
      `) as any[];
      return { items: rows as OpportunityCard[], total: parseInt(countRows[0]?.cnt || "0") };
    }

    const rows = (await sql`
      SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
      FROM biz_opportunities o
      JOIN biz_contents c ON o.content_id = c.id
      JOIN biz_sources s ON c.source_id = s.id
      WHERE o.is_business_case = true
      ORDER BY o.analyzed_at DESC
      LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
    `) as any[];
    const countRows = (await sql`
      SELECT COUNT(*) as cnt FROM biz_opportunities WHERE is_business_case = true
    `) as any[];
    return { items: rows as OpportunityCard[], total: parseInt(countRows[0]?.cnt || "0") };
  } catch {
    return { items: [], total: 0 };
  }
}

export default async function BizRadarDashboard({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.filter || "") as FilterType;
  const page = Math.max(1, parseInt(params.page || "1"));
  const { title, desc } = PAGE_TITLES[filter] || PAGE_TITLES[""];

  const { items, total } = await fetchOpportunities(filter, page);

  return (
    <>
      <div className="aibizradar-header">
        <h1>{title}</h1>
        <p>{desc}{total > 0 ? ` · 共 ${total} 条商机` : ""}</p>
      </div>

      <Suspense fallback={<BizLoadingSkeleton />}>
        {items.length > 0 ? (
          items.map((item) => <BizCard key={item.id} item={item} />)
        ) : (
          <div className="aibizradar-empty">
            暂无商机数据。Pipeline 运行后将自动填充。
          </div>
        )}
      </Suspense>
    </>
  );
}
