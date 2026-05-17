import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/aihot/db";
import { fetchSources } from "@/lib/aihot/fetcher";
import { deduplicate } from "@/lib/aihot/dedupe";
import { saveScoredItems } from "@/lib/aihot/scorer";
import { prefilterAI } from "@/lib/aihot/prefilter";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();

    // Fetch due sources — process all at once (daily cron on Hobby plan)
    const sources = (await sql`
      SELECT * FROM sources
      WHERE active = true
        AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
      ORDER BY tier ASC, last_fetched_at ASC NULLS FIRST
    `) as any[];

    if (sources.length === 0) {
      return NextResponse.json({ message: "No sources due for fetching" });
    }

    // Fetch content from sources
    const fetchResults = await fetchSources(sources);

    // Update source stats
    let totalFetched = 0;
    const allItems: any[] = [];
    for (const result of fetchResults) {
      if (result.success) {
        await sql`UPDATE sources SET last_fetched_at = NOW(), success_count = success_count + 1 WHERE id = ${result.source_id}`;
        allItems.push(...result.items);
        totalFetched += result.items.length;
      } else {
        await sql`UPDATE sources SET fail_count = fail_count + 1 WHERE id = ${result.source_id}`;
      }
    }

    // Deduplicate
    const newItems = await deduplicate(allItems);

    // Pre-filter: keyword-based, zero LLM cost
    const filtered = prefilterAI(newItems);

    // Score and save
    let scored = 0;
    if (filtered.length > 0) {
      scored = await saveScoredItems(filtered);
    }

    return NextResponse.json({
      sources: sources.length,
      fetched: totalFetched,
      newItems: newItems.length,
      prefiltered: filtered.length,
      scored,
    });
  } catch (err: any) {
    console.error("Pipeline error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Also support GET for Vercel Cron (cron sends GET by default)
export async function GET(req: NextRequest) {
  return POST(req);
}
