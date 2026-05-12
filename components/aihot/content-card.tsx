"use client";

import type { ScoredItem } from "@/lib/aihot/types";
import { ScoreCircle } from "./score-circle";

export function ContentCard({ item }: { item: ScoredItem }) {
  return (
    <div className="aihot-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
          <span className="aihot-card-source">{item.source_name}</span>
          <span className="aihot-card-tier">{item.source_tier}</span>
        </div>
        <ScoreCircle score={item.score} />
      </div>
      <div className="aihot-card-title">
        {item.translated_title || item.title}
      </div>
      <div className="aihot-card-summary">{item.summary_cn}</div>
      <div className="aihot-card-reason">{item.reason}</div>
      <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap" }}>
        {item.keywords.split(",").map((kw) => (
          <span key={kw} className="aihot-card-keyword">{kw.trim()}</span>
        ))}
      </div>
      <div className="aihot-card-meta">
        <span>{item.published_at ? new Date(item.published_at).toLocaleDateString("zh-CN") : ""}</span>
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--sage2)" }}>
          原文
        </a>
        <button className={`aihot-card-fav-btn ${item.is_favorited ? "is-fav" : ""}`}>
          {item.is_favorited ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
