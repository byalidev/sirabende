import type { ReactNode } from "react";
import { AdminNavigation } from "../../components/admin/AdminNavigation";
import { getCurrentUser } from "../../server/auth/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/giris");
  if (!user.userRoles.some(({ role }) => role.name === "ADMIN" || role.name === "SUPER_ADMIN")) return <main className="dashboard-content"><h1>403</h1><p>Bu alana erişim yetkiniz yok.</p></main>;
  return <div className="dashboard-layout"><AdminNavigation isSuperAdmin={user.userRoles.some(({ role }) => role.name === "SUPER_ADMIN")} /><main className="dashboard-content">{children}</main></div>;
}
