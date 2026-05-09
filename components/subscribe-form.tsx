'use client';

import { useState } from 'react';
import { subscribe } from '@/lib/subscribe';

export function SubscribeForm({ source }: { source: 'homepage' | 'article' | 'placeholder' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !consent) return;
    setStatus('loading');

    const result = await subscribe({ email, source, consent });
    setMessage(result.message);
    setStatus(result.success ? 'success' : 'error');

    if (result.success) {
      setEmail('');
      setConsent(false);
    }
  }

  return (
    <div className="subscribe-section">
      <h3 className="subscribe-title">订阅更新</h3>
      <p className="subscribe-desc">第一时间获取新内容推送</p>
      <form className="subscribe-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="subscribe-input"
          disabled={status === 'loading'}
        />
        <label className="subscribe-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>我已阅读并同意 <a href="/privacy">隐私政策</a></span>
        </label>
        <button type="submit" className="subscribe-btn" disabled={status === 'loading' || !consent}>
          {status === 'loading' ? '提交中...' : '订阅'}
        </button>
      </form>
      {message && (
        <p className={`subscribe-message ${status === 'success' ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
