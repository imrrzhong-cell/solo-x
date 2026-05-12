import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  const rows = await sql`SELECT * FROM sources ORDER BY tier, category, name`;
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const { name, url, feed_type, tier, category } = await req.json();
  try {
    const rows = await sql`INSERT INTO sources (name, url, feed_type, tier, category) VALUES (${name}, ${url}, ${feed_type}, ${tier}, ${category}) RETURNING *`;
    const arr = rows as unknown[];
    return NextResponse.json(arr[0], { status: 201 });
  } catch (e: unknown) { return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 400 }); }
}
