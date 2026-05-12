import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { content_id, human_score, note } = await req.json();
  await sql`UPDATE scored_contents SET human_score = ${human_score}, feedback_note = ${note || null}, feedback_at = now() WHERE content_id = ${content_id}`;
  return NextResponse.json({ ok: true });
}
