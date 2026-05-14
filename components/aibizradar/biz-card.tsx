import type { OpportunityCard } from "@/lib/aibizradar/types";
import { getRevenueHighlight } from "@/lib/aibizradar/constants";
import { ScoreBar } from "./score-bar";

export function BizCard({ item }: { item: OpportunityCard }) {
  const hasRevenue = getRevenueHighlight(item.revenue_hint);

  return (
    <div className="aibizradar-card">
      <div className="aibizradar-card-top">
        <div className="aibizradar-tags">
          {(item.tags || []).map((tag) => (
            <span key={tag} className="aibizradar-tag">{tag}</span>
          ))}
        </div>
        {hasRevenue && (
          <span className="aibizradar-revenue">{item.revenue_hint}</span>
        )}
      </div>

      <div className="aibizradar-card-title">
        {item.project_name || item.title || "未命名项目"}
      </div>

      <div className="aibizradar-grid">
        <div className="aibizradar-grid-cell">
          <div className="aibizradar-grid-label">目标客群</div>
          <div className="aibizradar-grid-value">{item.target_audience || "—"}</div>
        </div>
        <div className="aibizradar-grid-cell">
          <div className="aibizradar-grid-label">解决痛点</div>
          <div className="aibizradar-grid-value">{item.pain_point || "—"}</div>
        </div>
        <div className="aibizradar-grid-cell">
          <div className="aibizradar-grid-label">商业模式</div>
          <div className="aibizradar-grid-value">{item.business_model || "—"}</div>
        </div>
        <div className="aibizradar-grid-cell">
          <div className="aibizradar-grid-label">OPC 适配度</div>
          <ScoreBar score={item.opc_fit_score} label="" />
        </div>
      </div>

      {item.takeaways_cn && (
        <div className="aibizradar-insight">
          <div className="aibizradar-insight-label">实操建议</div>
          <div className="aibizradar-insight-text">{item.takeaways_cn}</div>
        </div>
      )}

      <div className="aibizradar-card-footer">
        <span>
          {item.analyzed_at
            ? new Date(item.analyzed_at).toLocaleDateString("zh-CN")
            : ""}
        </span>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          原文 →
        </a>
      </div>
    </div>
  );
}
