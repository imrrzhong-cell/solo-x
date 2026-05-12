import { sql } from "@/lib/aihot/db";
import type { DailyReport, ReportItem } from "@/lib/aihot/types";
import { ScoreCircle } from "@/components/aihot/score-circle";
import { CATEGORIES } from "@/lib/aihot/constants";
import { DbUnavailable } from "@/components/aihot/db-unavailable";

export const revalidate = 3600;

async function getDailyReport(
  date: string
): Promise<DailyReport | null> {
  const rows = (await sql`SELECT * FROM reports WHERE report_type = 'daily' AND report_date = ${date} LIMIT 1`) as any[];
  return (rows[0] as unknown as DailyReport) || null;
}

function getWeekDates(date: Date): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(date);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const targetDate = params.date || today.toISOString().split("T")[0];
  const weekDates = getWeekDates(new Date(targetDate));

  let report: DailyReport | null = null;
  let dbAvailable = true;
  try {
    report = await getDailyReport(targetDate);
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return <DbUnavailable />;
  }

  if (!report) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.2rem",
            color: "var(--char3)",
          }}
        >
          {targetDate} 暂无日报
        </p>
        <p
          style={{ fontSize: ".82rem", color: "var(--char3)", marginTop: ".5rem" }}
        >
          日报每日 07:00 自动生成
        </p>
      </div>
    );
  }

  const categories = report.content_json as Record<string, ReportItem[]>;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 500,
              color: "var(--char)",
            }}
          >
            {report.title}
          </h2>
          <span
            style={{
              fontSize: ".72rem",
              color: "var(--char3)",
              letterSpacing: ".15em",
              textTransform: "uppercase",
            }}
          >
            {targetDate}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        {weekDates.map((d) => (
          <a
            key={d}
            href={`/webapps/aihot/daily?date=${d}`}
            style={{
              display: "inline-block",
              padding: ".4rem .8rem",
              marginRight: ".5rem",
              marginBottom: ".5rem",
              borderRadius: "var(--radius-pill)",
              fontSize: ".72rem",
              textDecoration: "none",
              background: d === targetDate ? "var(--sage2)" : "var(--sage4)",
              color: d === targetDate ? "var(--white)" : "var(--char2)",
            }}
          >
            {new Date(d).toLocaleDateString("zh-CN", {
              month: "numeric",
              day: "numeric",
            })}
          </a>
        ))}
      </div>

      {report.summary && (
        <div className="aihot-narrative" style={{ marginBottom: "2rem" }}>
          {report.summary}
        </div>
      )}

      {CATEGORIES.map(({ key, label }) => {
        const items = categories[key] || [];
        if (items.length === 0) return null;
        return (
          <div key={key} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: ".72rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--char3)",
                marginBottom: "1rem",
                paddingBottom: ".5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {label} ({items.length})
            </h3>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: ".8rem 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <ScoreCircle score={item.score} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "var(--char)",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: ".78rem",
                      color: "var(--char2)",
                      marginTop: ".3rem",
                    }}
                  >
                    {item.summary}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: ".7rem",
                      color: "var(--sage2)",
                      textDecoration: "none",
                    }}
                  >
                    原文 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
