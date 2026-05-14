import { NextRequest, NextResponse } from "next/server";
import { sql, ensureBizSchema } from "@/lib/aibizradar/db";
import type { OpportunityCard, FilterType } from "@/lib/aibizradar/types";

export async function GET(req: NextRequest) {
  try {
    await ensureBizSchema();

    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") || "") as FilterType;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const size = 20;
    const offset = (page - 1) * size;

    let countRows: any[];
    let rows: any[];

    if (filter === "ecommerce") {
      countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities
        WHERE is_business_case = true AND ecommerce_relevance_score > 70
      `) as any[];
      rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true AND o.ecommerce_relevance_score > 70
        ORDER BY o.analyzed_at DESC
        LIMIT ${size} OFFSET ${offset}
      `) as any[];
    } else if (filter === "money") {
      countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities
        WHERE is_business_case = true AND revenue_hint IS NOT NULL AND revenue_hint != '未提及'
      `) as any[];
      rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true AND o.revenue_hint IS NOT NULL AND o.revenue_hint != '未提及'
        ORDER BY o.analyzed_at DESC
        LIMIT ${size} OFFSET ${offset}
      `) as any[];
    } else {
      countRows = (await sql`
        SELECT COUNT(*) as cnt FROM biz_opportunities WHERE is_business_case = true
      `) as any[];
      rows = (await sql`
        SELECT o.*, c.url, c.title, c.published_at, s.name as source_name
        FROM biz_opportunities o
        JOIN biz_contents c ON o.content_id = c.id
        JOIN biz_sources s ON c.source_id = s.id
        WHERE o.is_business_case = true
        ORDER BY o.analyzed_at DESC
        LIMIT ${size} OFFSET ${offset}
      `) as any[];
    }

    const total = parseInt(countRows[0]?.cnt || "0");

    return NextResponse.json({
      items: rows as OpportunityCard[],
      total,
      page,
      pages: Math.ceil(total / size),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
