import { sql } from "@/lib/aihot/db";
import { NextResponse } from "next/server";


export async function GET() {
  const rows = await sql`SELECT sc.content_id, sc.human_score, sc.feedback_note, sc.feedback_at, c.title FROM scored_contents sc JOIN contents c ON c.id = sc.content_id WHERE sc.human_score IS NOT NULL ORDER BY sc.feedback_at DESC LIMIT 50`;
  return NextResponse.json({ items: rows });
}
