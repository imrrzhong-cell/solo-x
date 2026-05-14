import type { Metadata } from "next";
import { Suspense } from "react";
import { BizNav } from "@/components/aibizradar/biz-nav";

export const metadata: Metadata = {
  title: "AI 商业情报雷达",
  description: "AI BizRadar — 自动抓取全球独立开发者社区、SaaS 交易平台的商业情报，拆解商业模式与收入数据",
};

export default function AibizradarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aibizradar-layout">
      <Suspense>
        <BizNav />
      </Suspense>
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {children}
      </div>
    </div>
  );
}
