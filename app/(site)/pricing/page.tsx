import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { InkDivider } from '@/components/ink-divider';

export const metadata: Metadata = {
  title: '会员计划',
  description: '免费进入，深入同行。三档会员计划，选择你的创作境界。',
};

const TIERS = [
  {
    tier: '探索者 · Explorer',
    price: '¥0',
    period: '永久免费',
    feats: ['免费内容无限阅读', '基础工具 6 款', '每月 3 篇付费内容', '广告支持版本'],
    btn: '免费开始',
    pick: false,
  },
  {
    tier: '创作者 · Creator',
    price: '¥68',
    period: '/ 月 · 按月订阅',
    feats: ['全部内容无限访问', '17 款 Pro 工具全解锁', '视频课程完整访问', '全部 Web App', '无广告纯净体验', '创作者专属社群'],
    btn: '开启创作者',
    pick: true,
  },
  {
    tier: '年度会员 · Annual',
    price: '¥580',
    period: '/ 年 · 节省 28%',
    feats: ['创作者全部权益', '年度独家研究报告', '1v1 问答机会', '新功能优先体验', '专属年度徽章'],
    btn: '选择年度',
    pick: false,
  },
];

const BOUNDS = [
  { type: '阅', name: '阅读', desc: '免费层无限阅读公开内容；Creator 解锁全部付费文章与深度研究；Annual 额外获得年度独家报告。' },
  { type: '用', name: '工具', desc: '免费层可使用 6 款基础工具；Creator 解锁全部 17 款 Pro 工具与 Web 应用。' },
  { type: '共', name: '社群', desc: 'Creator 及以上可加入创作者专属社群，Annual 会员享有 1v1 问答与优先体验权。' },
];

export default function PricingPage() {
  return (
    <>
      <PageHead
        kicker="会员计划"
        title="免费进入，深入同行。"
        desc="三档会员，对应三种使用深度。免费层让你了解 SOLO.X，Creator 让你深度使用，Annual 让你长期同行。"
        kanji="会"
      />

      <section className="section">
        <div className="container">
          <div className="price-grid">
            {TIERS.map((t) => (
              <div key={t.tier} className={`pc-card${t.pick ? ' pick' : ''}`}>
                <div className="pc-tier">{t.tier}</div>
                <div className="pc-price">
                  <sup>¥</sup>{t.price.replace('¥', '')}
                </div>
                <div className="pc-period">{t.period}</div>
                <div className="pc-line" />
                <ul className="pc-feats">
                  {t.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="pc-btn">{t.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InkDivider sym="竹" />

      <section className="section alt">
        <div className="container">
          <div className="section-header">
            <div className="sec-season">权益边界</div>
            <h2 className="sec-title">每一层，都有明确的价值。</h2>
          </div>
          <div className="ct-grid">
            {BOUNDS.map((b) => (
              <div key={b.type} className="ct-item">
                <div className="ct-type">{b.type}</div>
                <div className="ct-name">{b.name}</div>
                <div className="ct-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
