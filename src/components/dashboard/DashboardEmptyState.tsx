import Link from "next/link";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  href: string;
  action: string;
};

export function DashboardEmptyState({ title, description, href, action }: DashboardEmptyStateProps) {
  return <div className="dashboard-empty-state"><span className="dashboard-empty-icon">＋</span><h3>{title}</h3><p>{description}</p><Link className="button-primary" href={href}>{action} ↗</Link></div>;
}
