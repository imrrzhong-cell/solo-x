export function PageHead({ kicker, title, desc, kanji }: { kicker: string; title: string; desc: string; kanji: string }) {
  return (
    <header className="page-head">
      <div className="container">
        <div className="eyebrow">{kicker}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-desc">{desc}</p>
        <div className="page-kanji">{kanji}</div>
      </div>
    </header>
  );
}
