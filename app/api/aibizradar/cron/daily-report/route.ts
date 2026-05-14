import { NextRequest, NextResponse } from "next/server";
import { ensureBizSchema } from "@/lib/aibizradar/db";
import { buildDailyReport } from "@/lib/aibizradar/report-builder";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureBizSchema();
    const today = new Date().toISOString().slice(0, 10);
    await buildDailyReport(today);
    return NextResponse.json({ ok: true, date: today });
  } catch (err: any) {
    console.error("BizRadar daily report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
