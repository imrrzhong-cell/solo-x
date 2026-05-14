/**
 * 本地统一 Pipeline 脚本
 * 用法: npx tsx scripts/run-all-pipelines.ts [--aihot] [--aibizradar] [--report]
 * 不带参数则运行全部
 */
import { ensureSchema, sql } from "../lib/aihot/db";
import { ensureBizSchema } from "../lib/aibizradar/db";
import { seedSources } from "../lib/aihot/seed-sources";
import { seedBizSources } from "../lib/aibizradar/seed-sources";
import { fetchSources } from "../lib/aihot/fetcher";
import { deduplicate } from "../lib/aihot/dedupe";
import { saveScoredItems } from "../lib/aihot/scorer";
import { buildDailyReport, buildWeeklyReport, saveReport } from "../lib/aihot/report-builder";
import { bizDeduplicate, saveAnalyzedItems } from "../lib/aibizradar/analyzer";
import { buildDailyReport as buildBizDailyReport } from "../lib/aibizradar/report-builder";
import { ensureArticleSchema } from "../lib/article-gen/db";
import { generateAihotDeepRead, generateBizradarBizInsight } from "../lib/article-gen/generator";

const args = process.argv.slice(2);
const runAll = args.length === 0;
const runAihot = runAll || args.includes("--aihot");
const runBiz = runAll || args.includes("--aibizradar");
const runReport = runAll || args.includes("--report");

async function aihotPipeline() {
  console.log("\n=== AIHOT Pipeline ===");
  await ensureSchema();
  await seedSources(sql);

  const sources = (await sql`
    SELECT * FROM sources WHERE active = true
      AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
    ORDER BY tier ASC, last_fetched_at ASC NULLS FIRST
  `) as any[];
  console.log(`AIHOT sources to fetch: ${sources.length}`);

  if (sources.length === 0) {
    console.log("AIHOT: no sources due");
    return;
  }

  const results = await fetchSources(sources);
  const allItems: any[] = [];
  for (const r of results) {
    if (r.success) {
      await sql`UPDATE sources SET last_fetched_at = NOW(), success_count = success_count + 1 WHERE id = ${r.source_id}`;
      allItems.push(...r.items);
    } else {
      await sql`UPDATE sources SET fail_count = fail_count + 1 WHERE id = ${r.source_id}`;
      console.log(`  ${r.source_name}: FAIL - ${r.error}`);
    }
  }
  console.log(`AIHOT fetched: ${allItems.length}`);

  const newItems = await deduplicate(allItems);
  console.log(`AIHOT after dedup: ${newItems.length}`);

  let scored = 0;
  if (newItems.length > 0) {
    scored = await saveScoredItems(newItems);
  }
  console.log(`AIHOT scored: ${scored}`);
}

async function aihotReport() {
  console.log("\n=== AIHOT Reports ===");
  const today = new Date().toISOString().slice(0, 10);

  const daily = await buildDailyReport(today);
  await saveReport("daily", today, daily.title, daily.summary, daily.contentJson);
  console.log(`AIHOT daily report: ${today} (${daily.contentJson ? Object.values(daily.contentJson).flat().length : 0} items)`);

  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 1) {
    const weekStart = today;
    const weekly = await buildWeeklyReport(weekStart);
    await saveReport("weekly", weekStart, weekly.title, weekly.summary, weekly.contentJson);
    console.log(`AIHOT weekly report: ${weekStart}`);
  }
}

async function bizPipeline() {
  console.log("\n=== BizRadar Pipeline ===");
  await ensureBizSchema();
  await seedBizSources(sql);

  const sources = (await sql`
    SELECT * FROM biz_sources WHERE active = true
      AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
    ORDER BY tier ASC, last_fetched_at ASC NULLS FIRST
  `) as any[];
  console.log(`BizRadar sources to fetch: ${sources.length}`);

  if (sources.length === 0) {
    console.log("BizRadar: no sources due");
    return;
  }

  const results = await fetchSources(sources);
  const allItems: any[] = [];
  for (const r of results) {
    if (r.success) {
      await sql`UPDATE biz_sources SET last_fetched_at = NOW(), success_count = success_count + 1 WHERE id = ${r.source_id}`;
      allItems.push(...r.items);
    } else {
      await sql`UPDATE biz_sources SET fail_count = fail_count + 1 WHERE id = ${r.source_id}`;
      console.log(`  ${r.source_name}: FAIL - ${r.error}`);
    }
  }
  console.log(`BizRadar fetched: ${allItems.length}`);

  const newItems = await bizDeduplicate(allItems);
  console.log(`BizRadar after dedup: ${newItems.length}`);

  let analyzed = 0;
  if (newItems.length > 0) {
    analyzed = await saveAnalyzedItems(newItems);
  }
  console.log(`BizRadar biz cases saved: ${analyzed}`);
}

async function bizReport() {
  console.log("\n=== BizRadar Report ===");
  const today = new Date().toISOString().slice(0, 10);
  await buildBizDailyReport(today);
  console.log(`BizRadar daily report: ${today}`);
}

async function generateArticles() {
  console.log("\n=== Article Generation ===");
  await ensureArticleSchema();
  const today = new Date().toISOString().slice(0, 10);

  try {
    const aihotArticle = await generateAihotDeepRead(today);
    console.log(`AIHOT deep read: ${today} (${aihotArticle.content_md.length} chars)`);
  } catch (err) {
    console.error("AIHOT deep read failed:", err);
  }

  try {
    const bizArticle = await generateBizradarBizInsight(today);
    console.log(`BizRadar biz insight: ${today} (${bizArticle.content_md.length} chars)`);
  } catch (err) {
    console.error("BizRadar biz insight failed:", err);
  }
}

async function main() {
  const start = Date.now();
  console.log(`Pipeline started at ${new Date().toISOString()}`);
  console.log(`Mode: ${runAll ? "ALL" : args.join(", ")}`);

  try {
    if (runAihot) await aihotPipeline();
    if (runBiz) await bizPipeline();
    if (runReport) {
      await aihotReport();
      await bizReport();
    }

    if (runReport) {
      await generateArticles();
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\nPipeline completed in ${elapsed}s`);
  } catch (err) {
    console.error("Pipeline failed:", err);
    process.exit(1);
  }

  process.exit(0);
}

main();
