export function InkDivider({ sym = '竹' }: { sym?: string }) {
  return (
    <div className="ink-div">
      <span className="ink-sym">{sym}</span>
    </div>
  );
}
