import { sql } from "@/lib/aihot/db";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { note, tags } = await req.json();
  const rows = await sql`UPDATE favorites SET note = ${note}, tags = ${tags} WHERE id = ${id} RETURNING *`;
  const arr = rows as unknown[];
  return NextResponse.json(arr[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM favorites WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
