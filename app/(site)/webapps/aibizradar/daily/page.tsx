import { sql, ensureBizSchema } from "@/lib/aibizradar/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "每日商业快报 · AI BizRadar",
  description: "每日 AI 搞钱内参，总结高适配度商业情报",
};

export const dynamic = "force-dynamic";

export default async function DailyReportPage() {
  try {
    await ensureBizSchema();

    const reports = (await sql`
      SELECT * FROM biz_reports
      WHERE report_type = 'daily'
      ORDER BY report_date DESC
      LIMIT 7
    `) as any[];

    if (reports.length === 0) {
      return (
        <div className="aibizradar-empty">
          暂无快报数据。每日快报将在 Pipeline 运行后自动生成。
        </div>
      );
    }

    return (
      <>
        <div className="aibizradar-header">
          <h1>每日商业快报</h1>
          <p>AI 搞钱内参 · 近 7 天</p>
        </div>

        {reports.map((report: any) => (
          <div key={report.id} className="aibizradar-report">
            <div className="aibizradar-report-date">
              {new Date(report.report_date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div
              className="aibizradar-report-body"
              dangerouslySetInnerHTML={{
                __html: (report.narrative || "")
                  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                  .replace(/^## (.+)$/gm, '<h3>$1</h3>')
                  .replace(/^# (.+)$/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br />'),
              }}
            />
          </div>
        ))}
      </>
    );
  } catch {
    return (
      <div className="aibizradar-empty">
        数据库连接失败，请检查配置。
      </div>
    );
  }
}
