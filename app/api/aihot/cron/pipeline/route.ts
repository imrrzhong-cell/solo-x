import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const w = process.env.WORKER_API_URL; const k = process.env.WORKER_API_KEY;
  if (!w) return NextResponse.json({ error: "Worker not configured" }, { status: 503 });
  try {
    const res = await fetch(`${w}/worker/pipeline`, { method: "POST", headers: { "X-Worker-Key": k || "", "Content-Type": "application/json" } });
    return NextResponse.json({ success: true, workerResponse: await res.json() });
  } catch { return NextResponse.json({ success: false, error: "Worker unreachable" }, { status: 502 }); }
}
