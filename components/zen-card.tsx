export function ZenCard({
  num,
  label,
  desc,
}: {
  num: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="zen-card">
      <div className="zc-num">{num}</div>
      <div className="zc-label">{label}</div>
      <div className="zc-desc">{desc}</div>
    </div>
  );
}
