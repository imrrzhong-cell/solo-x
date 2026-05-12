import { sql } from "@/lib/aihot/db";
import { NextResponse } from "next/server";


export async function GET() {
  const rows = await sql`SELECT DISTINCT trim(unnest(string_to_array(tags, ','))) as tag FROM favorites WHERE tags IS NOT NULL`;
  return NextResponse.json({ tags: (rows as Record<string, unknown>[]).map(r => (r.tag as string).trim()).filter(Boolean) });
}
