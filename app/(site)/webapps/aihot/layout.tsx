import type { Metadata } from "next";
import { AihotNav } from "@/components/aihot/aihot-nav";

export const metadata: Metadata = {
  title: "AI 热点监控",
  description: "MyAIHOT — 个人 AI 热点监控与日报系统",
};

export default function AihotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aihot-layout">
      <AihotNav />
      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {children}
      </div>
    </div>
  );
}
