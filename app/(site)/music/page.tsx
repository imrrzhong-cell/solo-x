import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { music } from '@/lib/data';

export const metadata: Metadata = {
  title: '原创音乐',
  description: 'SOLO.X 原创音乐 — 为内容、视频和产品叙事制作的原创音乐，强调情绪密度和品牌记忆。',
};

const IDX = ['壹', '贰', '叁', '肆', '伍', '陆'];

export default function MusicPage() {
  return (
    <>
      <PageHead
        kicker="原创音乐"
        title="声音，是内容的第二条线。"
        desc="为内容、视频和产品叙事制作的原创音乐。每首曲子对应一个创作阶段的心境与灵感——从清晨的钢琴小品到深夜的电子实验，用声音表达文字无法传达的情绪。"
        kanji="音"
      />

      <section className="section">
        <div className="container">
          <div className="content-grid">
            {music.map(([name, duration, desc], i) => (
              <div key={name} className="ct-item">
                <span className="ct-index">{IDX[i]}</span>
                <div className="ct-type">Music</div>
                <div className="ct-name">{name}</div>
                <div className="ct-desc">{desc}</div>
                <div className="ct-foot">
                  <span className="ct-count">{duration}</span>
                  <span className="ct-price price-free">免费收听</span>
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
