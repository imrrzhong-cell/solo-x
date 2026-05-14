export function BizLoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aibizradar-skeleton">
          <div className="aibizradar-skeleton-bar" style={{ width: "40%" }} />
          <div className="aibizradar-skeleton-bar" style={{ width: "80%" }} />
          <div className="aibizradar-skeleton-bar" style={{ width: "60%" }} />
          <div className="aibizradar-skeleton-bar" style={{ width: "90%" }} />
          <div className="aibizradar-skeleton-bar" style={{ width: "50%" }} />
        </div>
      ))}
    </>
  );
}
