import type { ReactNode } from "react";
import { DashboardNavigation } from "../../components/dashboard/DashboardNavigation";

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return <div className="dashboard-layout"><DashboardNavigation /><div className="dashboard-main-column"><main className="dashboard-content">{children}</main></div></div>;
}