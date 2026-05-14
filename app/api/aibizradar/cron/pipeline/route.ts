import { NextRequest, NextResponse } from "next/server";
import { sql, ensureBizSchema } from "@/lib/aibizradar/db";
import { seedBizSources } from "@/lib/aibizradar/seed-sources";
import { fetchSources, hashUrl, bizDeduplicate, saveAnalyzedItems } from "@/lib/aibizradar/analyzer";

export const maxDuration = 60;

async function runPipeline() {
  await ensureBizSchema();
  await seedBizSources(sql);

  const sources = (await sql`
    SELECT * FROM biz_sources
    WHERE active = true
      AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
    ORDER BY tier ASC, last_fetched_at ASC NULLS FIRST
  `) as any[];

  if (sources.length === 0) {
    return { message: "No sources due for fetching" };
  }

  const fetchResults = await fetchSources(sources);

  let totalFetched = 0;
  const allItems: any[] = [];
  for (const result of fetchResults) {
    if (result.success) {
      await sql`UPDATE biz_sources SET last_fetched_at = NOW(), success_count = success_count + 1 WHERE id = ${result.source_id}`;
      allItems.push(...result.items);
      totalFetched += result.items.length;
    } else {
      await sql`UPDATE biz_sources SET fail_count = fail_count + 1 WHERE id = ${result.source_id}`;
      console.error(`Source ${result.source_name} failed: ${result.error}`);
    }
  }

  const newItems = await bizDeduplicate(allItems);

  let analyzed = 0;
  if (newItems.length > 0) {
    analyzed = await saveAnalyzedItems(newItems);
  }

  return {
    sources: sources.length,
    fetched: totalFetched,
    newItems: newItems.length,
    bizCases: analyzed,
  };
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPipeline();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("BizRadar pipeline error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
