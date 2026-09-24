import type { ReactNode } from "react";
import { DashboardNavigation } from "../../components/dashboard/DashboardNavigation";
import { requireUser } from "../../server/auth/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  try { await requireUser(); } catch { redirect("/giris"); }
  return <div className="dashboard-layout"><DashboardNavigation /><div className="dashboard-main-column"><main className="dashboard-content">{children}</main></div></div>;
}
