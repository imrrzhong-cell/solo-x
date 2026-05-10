import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { pages } from '@/lib/data';

export const metadata: Metadata = {
  title: '导航页',
  description: 'SOLO.X 完整网站路由地图。',
};

export default function MapPage() {
  return (
    <>
      <PageHead
        kicker="导航页"
        title="单文件中的完整网站。"
        desc="SOLO.X 的所有页面路由一览。每一个链接都指向一个真实的页面或功能模块。"
        kanji="图"
      />

      <section className="section">
        <div className="container">
          <div className="map-grid">
            {pages.map((p, i) => (
              <a key={p.route} href={p.route} className="map-item">
                <div className="map-id">{i + 1}</div>
                <div className="map-name">{p.name}</div>
                <div className="map-path">{p.route}</div>
                <div className="map-desc">{p.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
