import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { apps } from '@/lib/data';

export const metadata: Metadata = {
  title: '微信小程序',
  description: 'SOLO.X 微信小程序 — 面向移动场景的效率工具、数据看板与轻量运营插件。',
};

const IDX = ['壹', '贰', '叁', '肆', '伍', '陆'];

export default function AppsPage() {
  return (
    <>
      <PageHead
        kicker="微信小程序"
        title="把创作流程装进口袋。"
        desc="专为独立创作者设计的微信小程序集合。效率工具、数据看板、内容管理——随时随地查看数据、管理内容、追踪收入。"
        kanji="肆"
      />

      <section className="section">
        <div className="container">
          <div className="content-grid">
            {apps.map(([name, desc], i) => (
              <div key={name} className="ct-item">
                <span className="ct-index">{IDX[i]}</span>
                <div className="ct-type">Mini App</div>
                <div className="ct-name">{name}</div>
                <div className="ct-desc">{desc}</div>
                <div className="ct-foot">
                  <span className="ct-count">小程序</span>
                  <span className="ct-price price-free">FREE / PRO</span>
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
