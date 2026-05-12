import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rows = await sql`UPDATE sources SET active = COALESCE(${body.active ?? null}, active), tier = COALESCE(${body.tier ?? null}, tier), fetch_interval_minutes = COALESCE(${body.fetch_interval_minutes ?? null}, fetch_interval_minutes) WHERE id = ${id} RETURNING *`;
  const arr = rows as unknown[];
  return NextResponse.json(arr[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM sources WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
