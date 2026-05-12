export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="aihot-grid-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aihot-skeleton" style={{ height: 240 }} />
      ))}
    </div>
  );
}
