import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { tools } from '@/lib/data';

export const metadata: Metadata = {
  title: 'OPC 工具箱',
  description: 'SOLO.X OPC 工具箱 — 18款效率工具，覆盖内容创作与商业运营的全链路。',
};

export default function ToolsPage() {
  return (
    <>
      <PageHead
        kicker="OPC工具箱"
        title="十八款工具，服务一条任务链。"
        desc="面向独立创作者的全链路效率工具集。从选题判断、内容生产、产品封装到商业变现，每一款工具对应一个可重复执行的动作，减少认知成本，提高交付质量。"
        kanji="器"
      />

      <section className="section">
        <div className="container">
          <div className="tools-grid">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="tl-item"
              >
                <div className="tl-name">{tool.name}</div>
                <div className="tl-desc">{tool.desc}</div>
                <div className={`tl-meta ${tool.tier === 'FREE' ? 'tl-free' : 'tl-pro'}`}>
                  {tool.tier === 'FREE' ? '免费工具' : 'Pro 专属'} · {tool.cat}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
