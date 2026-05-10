import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { webapps } from '@/lib/data';

export const metadata: Metadata = {
  title: '网页应用',
  description: 'SOLO.X 网页应用 — AI 写作、品牌命名、选题判断、商业灵感整理等可直接使用的 Web 工具。',
};

const IDX = ['壹', '贰', '叁', '肆', '伍', '陆'];

export default function WebAppsPage() {
  return (
    <>
      <PageHead
        kicker="网页应用"
        title="打开浏览器，即用。"
        desc="基于浏览器的专业创作工具集。AI 写作助手、品牌命名生成器、SEO 分析工具、内容排期系统——无需安装，打开即用。覆盖独立创作者从灵感到发布的完整链路。"
        kanji="伍"
      />

      <section className="section">
        <div className="container">
          <div className="content-grid">
            {webapps.map(([name, desc], i) => (
              <div key={name} className="ct-item">
                <span className="ct-index">{IDX[i]}</span>
                <div className="ct-type">Web App</div>
                <div className="ct-name">{name}</div>
                <div className="ct-desc">{desc}</div>
                <div className="ct-foot">
                  <span className="ct-count">网页应用</span>
                  <span className="ct-price price-paid">PRO</span>
                </div>
              </div>
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
