export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />;
}

export function RequestListSkeleton() {
  return (
    <div className="skeleton-page" role="status" aria-label="Sayfa yükleniyor">
      <div className="skeleton-hero" />
      <div className="container-shell skeleton-body">
        <Skeleton className="skeleton-search" />
        <div className="request-grid">
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
          <Skeleton className="skeleton-card" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="skeleton-dashboard" role="status" aria-label="Panel yükleniyor">
      <Skeleton className="skeleton-title" />
      <div className="dashboard-stat-grid">
        <Skeleton className="skeleton-stat" />
        <Skeleton className="skeleton-stat" />
        <Skeleton className="skeleton-stat" />
        <Skeleton className="skeleton-stat" />
      </div>
    </div>
  );
}
