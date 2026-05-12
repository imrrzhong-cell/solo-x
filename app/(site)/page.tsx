'use client';

import Link from 'next/link';
import { InkDivider } from '@/components/ink-divider';
import { SectionHeader } from '@/components/section-header';
import { Newsletter } from '@/components/newsletter';
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
            <div className="eyebrow fade-in">GEO驱动 · 一人公司 · 创作生态</div>
            <h1 className="hero-title fade-in delay-1">独行者创造的<br />无限可能</h1>
            <p className="hero-quote fade-in delay-2">文字之间，有光。<br />工具之中，有路。<br />一人之力，可成生态。</p>
            <div className="button-row fade-in delay-3">
              <Link href="/opcx" className="btn-sage">进入 OPC 系统</Link>
              <Link href="/articles" className="btn-plain">阅读最新文章 →</Link>
            </div>
          </div>
          <div className="stat-stack fade-in delay-2">
            <div className="hero-kanji">独</div>
            <div className="zen-card">
              <div className="stat-num">240+</div>
              <div className="stat-label">ORIGINAL CONTENT</div>
              <div className="stat-desc">文章、课程、工具说明、公开建设记录，形成可持续复用的内容资产。</div>
            </div>
            <div className="zen-card">
              <div className="stat-num">18</div>
              <div className="stat-label">OPC TOOLS</div>
              <div className="stat-desc">覆盖定位、选题、写作、产品、销售、复盘的一人公司工具箱。</div>
            </div>
            <div className="zen-card">
              <div className="stat-num">5K+</div>
              <div className="stat-label">CREATORS</div>
              <div className="stat-desc">面向技术型独立创作者、内容创业者与 OPC 方法论实践者。</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AIHOT 新功能公告 ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--sage4) 0%, var(--sage3) 100%)', padding: '2.5rem 0' }}>
        <div className="container">
          <Link href="/webapps/aihot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'var(--sage2)', color: 'var(--white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>NEW</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--char3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>网页应用</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 500, color: 'var(--char)', margin: 0 }}>MyAIHOT · AI 热点雷达上线</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--char2)', margin: '0.3rem 0 0 0', lineHeight: 1.6 }}>
                每日自动抓取 27 个顶级 AI 信源，智能评分筛选，生成日报和周报。覆盖 OpenAI、Anthropic、DeepMind、ArXiv、量子位等核心源。
              </p>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--sage2)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>立即体验 →</div>
          </Link>
        </div>
      </section>

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

      <InkDivider sym="∞" />

      {/* ── 会员计划 ── */}
      <section className="section">
        <div className="container">
          <SectionHeader kicker="会员计划" title="选择你的创作境界" haiku="免费进入，深入则同行。" />
          <div className="price-grid">
            <div className="pc-card">
              <div className="pc-tier">EXPLORER</div>
              <div className="pc-price"><sup>¥</sup>0</div>
              <div className="pc-period">永久免费</div>
              <div className="pc-line" />
              <ul className="pc-feats">
                <li>免费内容全量阅读</li>
                <li>6 款基础工具</li>
                <li>每月 3 篇付费文章预览</li>
                <li>邮件订阅入口</li>
              </ul>
              <Link href="/articles" className="pc-btn">开始阅读</Link>
            </div>
            <div className="pc-card pick">
              <div className="pc-tier">CREATOR</div>
              <div className="pc-price"><sup>¥</sup>68</div>
              <div className="pc-period">每月</div>
              <div className="pc-line" />
              <ul className="pc-feats">
                <li>全部文章与课程</li>
                <li>18 款 Pro 工具</li>
                <li>视频课程完整访问</li>
                <li>社群讨论与案例拆解</li>
              </ul>
              <Link href="/contact" className="pc-btn">申请开通</Link>
            </div>
            <div className="pc-card">
              <div className="pc-tier">ANNUAL</div>
              <div className="pc-price"><sup>¥</sup>580</div>
              <div className="pc-period">每年</div>
              <div className="pc-line" />
              <ul className="pc-feats">
                <li>创作者全部权益</li>
                <li>每月研究报告</li>
                <li>季度 1v1 问答</li>
                <li>新功能优先体验</li>
              </ul>
              <Link href="/contact" className="pc-btn">年度加入</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
