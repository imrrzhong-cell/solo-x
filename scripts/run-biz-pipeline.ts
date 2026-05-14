import { ensureBizSchema, sql } from "../lib/aibizradar/db";
import { seedBizSources } from "../lib/aibizradar/seed-sources";
import { fetchSources } from "../lib/aihot/fetcher";
import { bizDeduplicate, saveAnalyzedItems } from "../lib/aibizradar/analyzer";

async function run() {
  await ensureBizSchema();
  await seedBizSources(sql);

  const sources = await sql`SELECT * FROM biz_sources WHERE active = true ORDER BY tier ASC`;
  console.log("Sources:", (sources as any[]).length);

  const results = await fetchSources(sources as any[]);
  const allItems: any[] = [];
  for (const r of results) {
    if (r.success) {
      await sql`UPDATE biz_sources SET last_fetched_at = NOW(), success_count = success_count + 1 WHERE id = ${r.source_id}`;
      allItems.push(...r.items);
      console.log(r.source_name + ": " + r.items.length + " items");
    } else {
      await sql`UPDATE biz_sources SET fail_count = fail_count + 1 WHERE id = ${r.source_id}`;
      console.log(r.source_name + ": FAIL - " + r.error);
    }
  }
  console.log("Total fetched:", allItems.length);

  console.log("Deduplicating...");
  const newItems = await bizDeduplicate(allItems);
  console.log("After dedup:", newItems.length);

  if (newItems.length > 0) {
    console.log("Analyzing with LLM...");
    const saved = await saveAnalyzedItems(newItems);
    console.log("Business cases saved:", saved);
  } else {
    console.log("No new items to analyze.");
  }

  const opps = await sql`SELECT COUNT(*) as cnt FROM biz_opportunities WHERE is_business_case = true`;
  console.log("Total biz opportunities in DB:", (opps as any[])[0].cnt);

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
