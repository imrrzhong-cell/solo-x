'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">出了点问题</h1>
        <p className="error-message">页面加载时发生了错误</p>
        <button onClick={reset} className="error-link">重新加载</button>
        <a href="/" className="error-link-secondary">返回首页</a>
      </div>
    </div>
  );
}
