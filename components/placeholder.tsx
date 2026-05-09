export function Placeholder({
  title,
  number,
  description,
}: {
  title: string;
  number: string;
  description: string;
}) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <span className="placeholder-number">{number}</span>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-desc">{description}</p>
        <a href="/" className="btn-sage">返回首页</a>
      </div>
    </div>
  );
}
