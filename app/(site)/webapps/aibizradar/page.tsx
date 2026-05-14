import { sql, ensureBizSchema } from "@/lib/aibizradar/db";
import type { OpportunityCard, FilterType } from "@/lib/aibizradar/types";
import { BizCard } from "@/components/aibizradar/biz-card";
import { Suspense } from "react";
import { BizLoadingSkeleton } from "@/components/aibizradar/loading-skeleton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "": { title: "灵感大盘", desc: "最近识别到的、适合一人公司干的商业机会" },
  feasible: { title: "高可行性", desc: "在中国落地可行性高、OPC 适配度强的机会" },
  money: { title: "有收入验证", desc: "带有明确收入数据、别人已经跑通的案例" },
};

async function fetchOpportunities(filter: FilterType, page: number) {
  try {
    await ensureBizSchema();

    if (filter === "feasible") {
      const rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true AND o.opc_fit_score > 60
        ORDER BY o.opc_fit_score DESC, COALESCE(o.china_feasibility_score, 0) DESC
        LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
      `) as any[];
      const countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities
        WHERE is_business_case = true AND opc_fit_score > 60
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
        ORDER BY o.opc_fit_score DESC
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
      ORDER BY o.opc_fit_score DESC, COALESCE(o.china_feasibility_score, 0) DESC
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
