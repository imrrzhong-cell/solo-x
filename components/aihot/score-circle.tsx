import { getScoreColor } from "@/lib/aihot/constants";

export function ScoreCircle({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <span className="aihot-score" style={{ borderColor: color, color }}>
      {score}
    </span>
  );
}
