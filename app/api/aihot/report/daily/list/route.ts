import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");
  const rows = await sql`SELECT id, report_date, title FROM reports WHERE report_type = 'daily' ORDER BY report_date DESC LIMIT ${limit}`;
  return NextResponse.json({ items: rows });
}
