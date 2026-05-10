import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { games } from '@/lib/data';

export const metadata: Metadata = {
  title: '创意游戏',
  description: 'SOLO.X 创意游戏 — 轻量网页游戏，在游玩中探索创业与决策思维。',
};

const IDX = ['壹', '贰', '叁', '肆', '伍'];

export default function GamesPage() {
  return (
    <>
      <PageHead
        kicker="创意游戏"
        title="把抽象方法论做成体验。"
        desc="用轻量游戏训练选题、定价、产品化和现金流判断。玩完会有新的认知。"
        kanji="戏"
      />

      {/* ── 月影擂台 ── */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'var(--char)',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
          }}>
            <iframe
              src="/games/moonlight-arena/index.html"
              title="月影擂台"
              style={{
                width: '100%',
                height: '540px',
                border: 'none',
                display: 'block',
              }}
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 500, margin: 0 }}>月影擂台</h3>
                <p style={{ fontSize: '.82rem', color: 'var(--char3)', margin: '.4rem 0 0', lineHeight: 1.7 }}>
                  原创 2D 横版 1v1 格斗游戏 · 单人 VS CPU / 双人本地对战
                </p>
              </div>
              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <span className="tag">Phaser 3</span>
                <span className="tag">TypeScript</span>
                <span className="tag">双人</span>
                <span className="tag">AI 对手</span>
              </div>
            </div>
            <div className="split" style={{ marginTop: '1.5rem' }}>
              <div className="panel">
                <h4 className="panel-title">玩家 1 操作</h4>
                <ul className="plain-list">
                  <li>A / D：移动</li>
                  <li>W：跳跃 · S：下蹲</li>
                  <li>J：轻拳 · K：重拳</li>
                  <li>U：轻脚 · I：重脚</li>
                  <li>L：防御</li>
                  <li>O / P：特殊技</li>
                </ul>
              </div>
              <div className="panel off">
                <h4 className="panel-title">游戏角色</h4>
                <ul className="plain-list">
                  <li>绯月妖姬 — 狐妖/月影魔法，高伤害，重压制</li>
                  <li>烬羽舞刃 — 火焰短刃，快速位移，低血量高机动</li>
                </ul>
                <p style={{ fontSize: '.75rem', color: 'var(--char3)', marginTop: '1rem', lineHeight: 1.7 }}>
                  菜单支持鼠标点击，角色选择支持鼠标点击进入战斗。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 更多游戏预告 ── */}
      <section className="section">
        <div className="container">
          <div className="content-grid">
            {games.map(([name, desc], i) => (
              <div key={name} className="ct-item">
                <span className="ct-index">{IDX[i]}</span>
                <div className="ct-type">GAME</div>
                <h3 className="ct-name">{name}</h3>
                <p className="ct-desc">{desc}</p>
                <div className="ct-foot">
                  <span className="ct-count">即将上线</span>
                  <span className="ct-price price-free">FREE</span>
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
