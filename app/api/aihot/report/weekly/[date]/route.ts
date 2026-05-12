import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const rows = await sql`SELECT * FROM reports WHERE report_type = 'weekly' AND report_date = ${date} LIMIT 1`;
  const arr = rows as unknown[];
  if (!arr.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(arr[0]);
}
