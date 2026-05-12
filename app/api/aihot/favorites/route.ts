import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get("tag") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const size = parseInt(req.nextUrl.searchParams.get("size") || "20");
  const offset = (page - 1) * size;
  const rows = await sql`SELECT f.*, c.title, c.url, sc.score, sc.summary_cn FROM favorites f JOIN contents c ON c.id = f.content_id LEFT JOIN scored_contents sc ON sc.content_id = f.content_id WHERE 1=1 ${tag ? sql`AND f.tags ILIKE ${"%" + tag + "%"}` : sql``} ORDER BY f.created_at DESC LIMIT ${size} OFFSET ${offset}`;
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const { content_id, note, tags } = await req.json();
  const rows = await sql`INSERT INTO favorites (content_id, note, tags) VALUES (${content_id}, ${note || null}, ${tags || null}) RETURNING *`;
  const arr = rows as unknown[];
  return NextResponse.json(arr[0], { status: 201 });
}
