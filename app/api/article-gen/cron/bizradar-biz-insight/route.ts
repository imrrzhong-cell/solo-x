import { NextRequest, NextResponse } from "next/server";
import { ensureArticleSchema } from "@/lib/article-gen/db";
import { generateBizradarBizInsight } from "@/lib/article-gen/generator";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureArticleSchema();
    const today = new Date().toISOString().slice(0, 10);
    const article = await generateBizradarBizInsight(today);
    return NextResponse.json({ ok: true, date: today, title: article.title, chars: article.content_md.length });
  } catch (err: any) {
    console.error("BizRadar biz insight generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
