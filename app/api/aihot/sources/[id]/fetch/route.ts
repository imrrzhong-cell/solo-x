import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = process.env.WORKER_API_URL; const k = process.env.WORKER_API_KEY;
  if (!w) return NextResponse.json({ error: "Worker not configured" }, { status: 503 });
  const res = await fetch(`${w}/worker/pipeline/source/${id}`, { method: "POST", headers: { "X-Worker-Key": k || "" } });
  return NextResponse.json(await res.json(), { status: res.status });
}
