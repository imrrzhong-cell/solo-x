import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const w = process.env.WORKER_API_URL; const k = process.env.WORKER_API_KEY;
  if (!w) return NextResponse.json({ error: "Worker not configured" }, { status: 503 });
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(`${w}/worker/report/daily/${today}`, { method: "POST", headers: { "X-Worker-Key": k || "" } });
  return NextResponse.json(await res.json(), { status: res.status });
}
