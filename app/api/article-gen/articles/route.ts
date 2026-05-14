import { NextRequest, NextResponse } from "next/server";
import { ensureArticleSchema, sql } from "@/lib/article-gen/db";

function fmtDate(d: string | Date): string {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    await ensureArticleSchema();

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
    const date = url.searchParams.get("date") || "";

    let rows: any[];
    if (type && date) {
      rows = (await sql`
        SELECT * FROM generated_articles
        WHERE article_type = ${type} AND article_date = ${date}::date AND status = 'published'
      `) as any[];
    } else if (type) {
      rows = (await sql`
        SELECT * FROM generated_articles
        WHERE article_type = ${type} AND status = 'published'
        ORDER BY article_date DESC LIMIT ${limit}
      `) as any[];
    } else {
      rows = (await sql`
        SELECT * FROM generated_articles
        WHERE status = 'published'
        ORDER BY created_at DESC LIMIT ${limit}
      `) as any[];
    }

    return NextResponse.json({ items: rows.map((r: any) => ({
      ...r,
      article_date: fmtDate(r.article_date),
    })) });
  } catch (err: any) {
    console.error("Articles query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
