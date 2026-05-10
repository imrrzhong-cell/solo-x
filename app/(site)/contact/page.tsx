'use client';

import { useState } from 'react';
import { PageHead } from '@/components/page-head';

const TYPES = ['内容合作', '工具建议', '课程咨询', '会员问题', '其他'];

const CHANNELS = [
  { label: 'GitHub', desc: '查看开源项目与代码仓库。', href: '#' },
  { label: 'Twitter / X', desc: '关注动态，参与公开讨论。', href: '#' },
  { label: 'Email', desc: '直接发送邮件至 SOLO.X 邮箱。', href: '#' },
  { label: 'WeChat', desc: '添加微信，进入创作者社群。', href: '#' },
];

export default function ContactPage() {
  const [note, setNote] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote('已记录。正式上线后将通过邮件回复。');
  }

  return (
    <>
      <PageHead
        kicker="联系 SOLO.X"
        title="合作、反馈、加入。"
        desc="无论是内容合作、工具建议、课程咨询还是会员问题，都可以通过这个页面联系我。"
        kanji="信"
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="panel">
              <h2 className="panel-title">发送消息</h2>
              <form className="form" onSubmit={handleSubmit}>
                <input className="input" type="text" placeholder="你的称呼" required />
                <input className="input" type="email" placeholder="邮箱地址" required />
                <select className="select" required defaultValue="">
                  <option value="" disabled>选择类型</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <textarea className="textarea" placeholder="你想说的..." required />
                <label className="check">
                  <input type="checkbox" required />
                  <span>我理解 SOLO.X 当前处于内测阶段，回复可能需要一些时间。</span>
                </label>
                <button className="btn-sage" type="submit">发送</button>
                {note && <div className="form-note">{note}</div>}
              </form>
            </div>

            <div className="panel off">
              <h2 className="panel-title">其他入口</h2>
              <ul className="plain-list">
                {CHANNELS.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                      <strong>{c.label}</strong>
                      <br />
                      <span style={{ fontSize: '.75rem', color: 'var(--char3)' }}>{c.desc}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
