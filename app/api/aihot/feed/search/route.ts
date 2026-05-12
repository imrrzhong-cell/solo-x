import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q) return NextResponse.json({ items: [] });
  const rows = await sql`SELECT c.id, c.url, c.title, sc.score, sc.category, sc.summary_cn, sc.translated_title, sc.reason, sc.keywords, c.published_at, s.name as source_name, s.tier as source_tier FROM contents c JOIN scored_contents sc ON sc.content_id = c.id JOIN sources s ON s.id = c.source_id WHERE c.title ILIKE ${"%" + q + "%"} OR sc.summary_cn ILIKE ${"%" + q + "%"} ORDER BY sc.score DESC LIMIT 20`;
  return NextResponse.json({ items: rows });
}
