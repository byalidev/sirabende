type DashboardStatCardProps = {
  label: string;
  value: number;
  detail: string;
  icon: string;
};

export function DashboardStatCard({ label, value, detail, icon }: DashboardStatCardProps) {
  return <article className="dashboard-stat-card"><span className="dashboard-stat-icon" aria-hidden="true">{icon}</span><span className="dashboard-stat-label">{label}</span><strong>{value}</strong><span className="dashboard-stat-detail">{detail}</span></article>;
}
