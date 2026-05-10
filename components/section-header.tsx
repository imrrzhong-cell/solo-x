export function SectionHeader({ kicker, title, haiku }: { kicker: string; title: string; haiku: string }) {
  return (
    <div className="section-header">
      <div className="sec-season">{kicker}</div>
      <h2 className="sec-title">{title}</h2>
      <p className="sec-haiku">{haiku}</p>
    </div>
  );
}
