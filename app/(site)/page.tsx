'use client';

import Link from 'next/link';
import { InkDivider } from '@/components/ink-divider';
import { SectionHeader } from '@/components/section-header';
import { Newsletter } from '@/components/newsletter';
import { LatestArticleTimeline, LatestArticlesSection } from '@/components/latest-articles';
import { contentForms, tools } from '@/lib/data';

const TARGET_USERS = [
  { idx: '一', type: 'DEVELOPER CREATOR', name: '技术型独立创作者', desc: '有全栈能力、有 Side Project，想把技术能力转化为品牌、内容和收入。', count: '核心需求', price: '方法 + 工具' },
  { idx: '二', type: 'CONTENT FOUNDER', name: '内容创业转型者', desc: '已经有内容影响力，希望借助 AI 和小工具降低产品化门槛。', count: '核心需求', price: '产品化' },
  { idx: '三', type: 'OPC PRACTITIONER', name: 'OPC 探索者', desc: '已经实践一人公司，缺少系统框架、同类样本和可复用流程。', count: '核心需求', price: '框架 + 社群' },
];

const PATHWAY_STEPS = [
  { num: '01', title: '定位', desc: '确定长期母题、目标用户和可承受的最小市场。' },
  { num: '02', title: '内容', desc: '建立文章、视频、工具说明书的稳定表达资产。' },
  { num: '03', title: '工具', desc: '把高频动作封装为轻量工具，降低交付成本。' },
  { num: '04', title: '产品', desc: '把方法论转为课程、应用、会员和咨询权益。' },
  { num: '05', title: '复利', desc: '用公开建设、邮件和社群沉淀长期信任。' },
];

export default function Home() {
  const topTools = tools.slice(0, 8);

  return (
    <div className="page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow fade-in">我和我的朋友们</div>
            <h1 className="hero-title fade-in delay-1">有<br />无限可能</h1>
            <p className="hero-quote fade-in delay-2">文字之间，有光。<br />工具之中，有路。<br />众人之力，可成生态。</p>
            <div className="button-row fade-in delay-3">
              <Link href="/opcx" className="btn-sage">进入 OPC 系统</Link>
              <Link href="/articles" className="btn-plain">阅读最新文章 →</Link>
            </div>
          </div>
          <div className="stat-stack fade-in delay-2">
            <div className="hero-timeline">
              <Link href="/webapps/aibizradar" className="hero-timeline-item">
                <span className="hero-tl-date">2026-05-13</span>
                <span className="hero-tl-tag">NEW</span>
                <span className="hero-tl-title">搞钱雷达上线</span>
              </Link>
              <Link href="/webapps/aihot" className="hero-timeline-item">
                <span className="hero-tl-date">2026-05-10</span>
                <span className="hero-tl-tag">HOT</span>
                <span className="hero-tl-title">AI 热点雷达上线</span>
              </Link>
              <div className="hero-timeline-item">
                <span className="hero-tl-date">2026-05-08</span>
                <span className="hero-tl-tag">SITE</span>
                <span className="hero-tl-title">SOLO.X 正式上线</span>
              </div>
              <Link href="/article/one-person-company-operating-system" className="hero-timeline-item">
                <span className="hero-tl-date">2026-05-01</span>
                <span className="hero-tl-tag">ESSAY</span>
                <span className="hero-tl-title">一人公司的操作系统</span>
              </Link>
              <Link href="/article/geo-as-content-infrastructure" className="hero-timeline-item">
                <span className="hero-tl-date">2026-04-22</span>
                <span className="hero-tl-tag">TOOL</span>
                <span className="hero-tl-title">GEO 是新的内容基础设施</span>
              </Link>
              <Link href="/tools" className="hero-timeline-item">
                <span className="hero-tl-date">2026-04-15</span>
                <span className="hero-tl-tag">TOOL</span>
                <span className="hero-tl-title">OPC 工具箱上线</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 功能入口卡片 ── */}
      <section className="section" style={{ background: 'var(--off)', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link href="/webapps/aihot" style={{ display: 'block', background: 'var(--sage4)', borderRadius: 'var(--radius-card)', padding: '1.5rem', border: '1px solid var(--sage3)', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', background: 'var(--sage2)', color: 'var(--white)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>HOT</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--char)', margin: '0 0 0.3rem' }}>MyAIHOT · AI 热点雷达</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--char3)', margin: 0, lineHeight: 1.5 }}>37 个顶级 AI 信源，智能评分，日报周报。</p>
          </Link>
          <Link href="/webapps/aibizradar" style={{ display: 'block', background: 'var(--sage4)', borderRadius: 'var(--radius-card)', padding: '1.5rem', border: '1px solid var(--sage3)', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', background: 'var(--sage2)', color: 'var(--white)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>NEW</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--char)', margin: '0 0 0.3rem' }}>AI BizRadar · 搞钱雷达</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--char3)', margin: 0, lineHeight: 1.5 }}>全球独立开发者商机情报，拆解商业模式与收入数据。</p>
          </Link>
        </div>
      </section>

      {/* 每日解读楼层（文章推送功能暂未开放） */}
      {/* <LatestArticlesSection /> */}

      <InkDivider sym="竹" />

      {/* ── 六种内容形式 ── */}
      <section className="section">
        <div className="container">
          <SectionHeader kicker="内容创作" title="六种形式，一个宇宙" haiku="文章有骨，工具有用，课程有路。" />
          <div className="content-grid">
            {contentForms.map((form) => (
              <Link key={form.type} href={form.route} className="ct-item">
                <span className="ct-index">{form.idx}</span>
                <div className="ct-type">{form.type}</div>
                <h3 className="ct-name">{form.name}</h3>
                <p className="ct-desc">{form.desc}</p>
                <div className="ct-foot">
                  <span className="ct-count">{form.count}</span>
                  <span className={`ct-price ${form.price.includes('PRO') ? 'price-paid' : 'price-free'}`}>{form.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InkDivider sym="○" />

      {/* ── 目标用户 ── */}
      <section className="section alt">
        <div className="container">
          <SectionHeader kicker="目标用户" title="谁会从这里受益" haiku="不是围观结果，是拿走结构。" />
          <div className="content-grid">
            {TARGET_USERS.map((user) => (
              <div key={user.idx} className="ct-item">
                <span className="ct-index">{user.idx}</span>
                <div className="ct-type">{user.type}</div>
                <h3 className="ct-name">{user.name}</h3>
                <p className="ct-desc">{user.desc}</p>
                <div className="ct-foot">
                  <span className="ct-count">{user.count}</span>
                  <span className="ct-price price-paid">{user.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InkDivider sym="墨" />

      {/* ── OPC 工具箱 ── */}
      <section className="section">
        <div className="container">
          <SectionHeader kicker="OPC工具箱" title="效率，是最好的禅" haiku="把重复动作，压成可调用工具。" />
          <div className="tools-grid">
            {topTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`} className="tl-item">
                <h3 className="tl-name">{tool.name}</h3>
                <p className="tl-desc">{tool.desc}</p>
                <div className={`tl-meta ${tool.tier === 'FREE' ? 'tl-free' : 'tl-pro'}`}>{tool.tier} · {tool.cat}</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/tools" className="btn-plain">查看 18 款工具 →</Link>
          </div>
        </div>
      </section>

      <InkDivider sym="◆" />

      {/* ── 运营路径 ── */}
      <section className="section alt">
        <div className="container">
          <SectionHeader kicker="运营路径" title="从一个人，到一个系统" haiku="先有稳定动作，再有长期复利。" />
          <div className="pathway">
            {PATHWAY_STEPS.map((step) => (
              <div key={step.num} className="step">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 会员计划（隐藏，待收费体系就绪后开放）── */}

      {/* ── Newsletter ── */}
      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
