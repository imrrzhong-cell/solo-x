import { NextResponse } from "next/server";
import { sql, ensureBizSchema } from "@/lib/aibizradar/db";

export async function GET() {
  try {
    await ensureBizSchema();

    const rows = (await sql`
      SELECT * FROM biz_sources ORDER BY tier ASC, name ASC
    `) as any[];

    return NextResponse.json({ sources: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
