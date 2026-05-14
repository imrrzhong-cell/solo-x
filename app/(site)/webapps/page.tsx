import type { Metadata } from 'next';
import Link from 'next/link';
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
          <Link href="/webapps/aihot" style={{ display: 'block', background: 'var(--sage4)', borderRadius: 'var(--radius-card)', padding: '2rem', border: '1px solid var(--sage3)', textDecoration: 'none', transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--sage2)', color: 'var(--white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>NEW</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--char3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Web App</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--char)', marginBottom: '0.5rem' }}>MyAIHOT · AI 热点雷达</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--char2)', lineHeight: 1.7, margin: 0 }}>
              每日自动抓取 27 个 AI 领域顶级信源（OpenAI、Anthropic、DeepMind、ArXiv、量子位等），通过智能评分筛选高价值内容，生成日报和周报。
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--sage2)', letterSpacing: '0.1em' }}>查看 AI 热点 →</div>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Link href="/webapps/aibizradar" style={{ display: 'block', background: 'var(--sage4)', borderRadius: 'var(--radius-card)', padding: '2rem', border: '1px solid var(--sage3)', textDecoration: 'none', transition: 'transform 0.2s', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--sage2)', color: 'var(--white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>NEW</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--char3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Web App</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--char)', marginBottom: '0.5rem' }}>AI BizRadar · 搞钱雷达</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--char2)', lineHeight: 1.7, margin: 0 }}>
              自动抓取全球独立开发者社区、SaaS 交易平台的商业情报，LLM 拆解商业模式、目标客群与收入数据，评估一人公司可复刻的赚钱机会。
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--sage2)', letterSpacing: '0.1em' }}>查看搞钱情报 →</div>
          </Link>
        </div>
      </section>

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
