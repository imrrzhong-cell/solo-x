export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">肆零肆</h1>
        <p className="error-message">你访问的页面不存在</p>
        <p className="error-hint">可能已被移动、重命名，或从未存在</p>
        <a href="/" className="error-link">返回首页</a>
      </div>
    </div>
  );
}
