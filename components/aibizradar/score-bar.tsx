import { getScoreLabel } from "@/lib/aibizradar/constants";

export function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const { text, color } = getScoreLabel(score);
  const pct = score !== null ? Math.min(100, Math.max(0, score)) : 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".15rem" }}>
        <span style={{ fontSize: ".6rem", letterSpacing: ".1em", color: "var(--char3)" }}>{label}</span>
        <span style={{ fontSize: ".65rem", color }}>{text}</span>
      </div>
      <div className="aibizradar-score-bar">
        <div
          className="aibizradar-score-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
