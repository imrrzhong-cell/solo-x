'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const PRESETS = {
  article: '帮我创建一篇关于 ___ 的文章，类型为 essay，写好 frontmatter 和正文（500字以上），保存到 content/articles/ 目录，然后 git commit 并 push',
  feature: '帮我把 ___ 功能开关打开/关闭，修改 .env.local 中对应的 NEXT_PUBLIC_FEATURE___ 变量，然后 git commit 并 push',
  style: '帮我把 ___ 的样式调整为 ___，修改 app/globals.css 中对应的 CSS，然后 git commit 并 push',
  content: '帮我把首页的 ___ 区域修改为 ___，修改 app/(site)/page.tsx，然后 git commit 并 push',
};

export default function CommandPanel() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preset = searchParams.get('preset');
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam));
    } else if (preset && PRESETS[preset as keyof typeof PRESETS]) {
      setPrompt(PRESETS[preset as keyof typeof PRESETS]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setOutput('正在启动 Claude Code...\n\n');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/admin/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setOutput(prev => prev + text);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setOutput(prev => prev + `\n[错误] ${err.message}`);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
    setOutput(prev => prev + '\n[已手动停止]');
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">指令中心</h1>
      </div>

      <p style={{ fontSize: '.82rem', color: 'var(--char3)', marginBottom: '1.5rem', lineHeight: 1.8 }}>
        输入你想做的事，Claude Code 会在项目目录中执行。比如"帮我写一篇关于AI的文章"、"帮我把首页标语改成XXX"。
      </p>

      <div className="command-section">
        <div className="command-presets">
          <button className="command-preset" onClick={() => setPrompt(PRESETS.article)}>写新文章</button>
          <button className="command-preset" onClick={() => setPrompt(PRESETS.feature)}>开关板块</button>
          <button className="command-preset" onClick={() => setPrompt(PRESETS.style)}>调整样式</button>
          <button className="command-preset" onClick={() => setPrompt(PRESETS.content)}>修改内容</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <textarea
              className="admin-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="告诉我你想做什么..."
              rows={4}
              disabled={loading}
              style={{ minHeight: '100px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading || !prompt.trim()}>
              {loading ? '执行中...' : '执行'}
            </button>
            {loading && (
              <button type="button" className="admin-btn admin-btn-danger" onClick={handleStop}>
                停止
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="command-section">
        <div className="admin-section-title">执行结果</div>
        <div className="command-output" ref={outputRef}>{output}</div>
      </div>
    </>
  );
}
