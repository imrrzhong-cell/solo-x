import { NextRequest, NextResponse } from "next/server";
import { ensureSchema } from "@/lib/aihot/db";
import { buildWeeklyReport, saveReport } from "@/lib/aihot/report-builder";

export const maxDuration = 60;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();

    const monday = getWeekStart(new Date());
    const { title, summary, contentJson } = await buildWeeklyReport(monday);
    await saveReport("weekly", monday, title, summary, contentJson);

    return NextResponse.json({ weekStart: monday, title, itemCount: Object.values(contentJson).flat().length });
  } catch (err: any) {
    console.error("Weekly report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
