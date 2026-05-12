import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const days = parseInt(req.nextUrl.searchParams.get("days") || "7");
  const keywords = await sql`SELECT keyword, count FROM (SELECT trim(unnest(string_to_array(keywords, ','))) as keyword, count(*) FROM scored_contents WHERE is_featured = true AND scored_at > now() - interval '1 day' * ${days} GROUP BY 1 ORDER BY 2 DESC LIMIT 20) sub WHERE keyword != ''`;
  const daily = await sql`SELECT date(scored_at) as date, count(*) as count FROM scored_contents WHERE is_featured = true AND scored_at > now() - interval '1 day' * ${days} GROUP BY 1 ORDER BY 1`;
  return NextResponse.json({ trending_keywords: keywords, daily_counts: daily });
}
