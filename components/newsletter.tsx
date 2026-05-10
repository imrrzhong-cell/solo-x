'use client';

import { useState } from 'react';

export function Newsletter() {
  const [note, setNote] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote('已记录。正式上线后接入 Resend。');
  }

  return (
    <div className="newsletter">
      <div>
        <h3>把建设过程，寄给你。</h3>
        <p>每月一次，发送 SOLO.X 的文章、工具、课程和公开建设记录。只保留有用信息。</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <input className="input" type="email" placeholder="your@email.com" required />
        <label className="check">
          <input type="checkbox" required />
          <span>我同意接收邮件，并理解可以随时退订。</span>
        </label>
        <button className="btn-sage" type="submit">订阅</button>
        {note && <div className="form-note">{note}</div>}
      </form>
    </div>
  );
}
