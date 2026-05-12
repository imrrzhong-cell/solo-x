import { NextRequest, NextResponse } from "next/server";
import { ensureSchema } from "@/lib/aihot/db";
import { buildDailyReport, saveReport } from "@/lib/aihot/report-builder";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();

    // Use today's date
    const date = new Date().toISOString().split("T")[0];
    const { title, summary, contentJson } = await buildDailyReport(date);
    await saveReport("daily", date, title, summary, contentJson);

    return NextResponse.json({ date, title, itemCount: Object.values(contentJson).flat().length });
  } catch (err: any) {
    console.error("Daily report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
