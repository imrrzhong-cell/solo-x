import { sql } from "@/lib/aihot/db";
import { NextResponse } from "next/server";


export async function GET() {
  const rows = await sql`SELECT (SELECT count(*) FROM sources) as total_sources, (SELECT count(*) FROM sources WHERE active = true) as active_sources, (SELECT count(*) FROM contents) as total_contents, (SELECT count(*) FROM scored_contents) as total_scored`;
  const arr = rows as unknown[];
  return NextResponse.json(arr[0]);
}
