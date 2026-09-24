import Link from "next/link";
import { formatDate } from "../../../../components/admin/AdminPageParts";
import { getSuperAdminProfile } from "../../../../server/admin/audit";

export default async function SuperAdminProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const data = await getSuperAdminProfile((await params).id);
  if (!data) return <div className="dashboard-page"><h1>Admin bulunamadı.</h1></div>;
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Admin Profili</span><h1>{data.admin.username}</h1><p>{data.admin.email} · {data.admin.userRoles.map(({ role }) => role.name).join(", ")}</p></div><Link className="button-quiet" href="/admin/super">İşlem geçmişine dön</Link></header><section className="dashboard-panel-section"><p>Oluşturulma: {formatDate(data.admin.createdAt.toISOString())}</p><p>Son giriş: {data.admin.sessions[0] ? formatDate(data.admin.sessions[0].createdAt.toISOString()) : "-"}</p><p>Durum: {data.admin.isActive ? "Aktif" : "Pasif"}</p></section><section className="dashboard-stat-grid admin-stat-grid">{Object.entries({ "Yaptırım": data.stats.sanctions, "Ban": data.stats.bans, "Silinen talep": data.stats.deletedRequests, "Silinen teklif": data.stats.deletedOffers, "İncelenen rapor": data.stats.reports, "İncelenen mesaj": data.stats.messages }).map(([label, value]) => <article className="dashboard-stat-card" key={label}><span className="dashboard-stat-label">{label}</span><strong>{value}</strong></article>)}</section></div>;
}