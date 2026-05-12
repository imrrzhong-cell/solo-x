import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "featured";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const size = parseInt(req.nextUrl.searchParams.get("size") || "20");
  const category = req.nextUrl.searchParams.get("category") || "";
  const offset = (page - 1) * size;
  const cf = category ? sql`AND sc.category = ${category}` : sql``;

  if (type === "featured") {
    const rows = await sql`SELECT c.id, c.url, c.title, sc.score, sc.category, sc.summary_cn, sc.translated_title, sc.reason, sc.keywords, c.published_at, s.name as source_name, s.tier as source_tier FROM contents c JOIN scored_contents sc ON sc.content_id = c.id JOIN sources s ON s.id = c.source_id WHERE sc.is_featured = true ${cf} ORDER BY sc.score DESC, c.published_at DESC LIMIT ${size} OFFSET ${offset}`;
    const cnt = await sql`SELECT count(*) as total FROM scored_contents WHERE is_featured = true ${cf}`;
    const arr = cnt as unknown[];
    const total = Number((arr[0] as Record<string, unknown>).total);
    return NextResponse.json({ items: rows, total, page, pages: Math.ceil(total / size) });
  }
  const search = req.nextUrl.searchParams.get("search") || "";
  const sf = search ? sql`AND (c.title ILIKE ${"%" + search + "%"} OR sc.summary_cn ILIKE ${"%" + search + "%"})` : sql``;
  const rows = await sql`SELECT c.id, c.url, c.title, sc.score, sc.category, sc.summary_cn, sc.translated_title, sc.reason, sc.keywords, c.published_at, s.name as source_name, s.tier as source_tier FROM contents c JOIN scored_contents sc ON sc.content_id = c.id JOIN sources s ON s.id = c.source_id WHERE 1=1 ${cf} ${sf} ORDER BY c.published_at DESC LIMIT ${size} OFFSET ${offset}`;
  const arr = rows as unknown[];
  return NextResponse.json({ items: rows, total: arr.length, page, pages: 1 });
}
