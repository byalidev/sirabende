import Link from "next/link";
import { AdminPagination, formatDate } from "../../../components/admin/AdminPageParts";
import { SuperAdminControls } from "../../../components/admin/SuperAdminControls";
import { SuperAdminCreateForm } from "../../../components/admin/SuperAdminCreateForm";
import { getSuperAdminData } from "../../../server/admin/audit";

const actionLabels: Record<string, string> = {
  ADMIN_CREATED: "Admin oluşturuldu", ADMIN_STATUS_CHANGED: "Admin durumu değişti", ADMIN_ROLE_CHANGED: "Admin rolü değişti",
  ADMIN_BAN_USER: "Kullanıcı banlandı", ADMIN_UNBAN_USER: "Kullanıcı banı kaldırıldı", ADMIN_REVOKE_SANCTION: "Yaptırım geri çekildi",
  ADMIN_DELETE_REQUEST: "Talep silindi", ADMIN_DELETE_OFFER: "Teklif silindi", ADMIN_APPLY_SANCTION: "Yaptırım uygulandı",
  ADMIN_REVIEW_REPORT: "Rapor incelendi", ADMIN_REVIEW_MESSAGE: "Mesaj incelendi", ADMIN_DELETE_REPORT: "Rapor silindi",
};

function targetLabel(log: { targetUsername: string | null; targetRequestId: string | null; targetOfferId: string | null; targetReportId: string | null; targetMessageId: string | null }) {
  if (log.targetUsername) return log.targetUsername;
  if (log.targetRequestId) return `Talep ${log.targetRequestId.slice(0, 8)}`;
  if (log.targetOfferId) return `Teklif ${log.targetOfferId.slice(0, 8)}`;
  if (log.targetReportId) return `Rapor ${log.targetReportId.slice(0, 8)}`;
  if (log.targetMessageId) return `Mesaj ${log.targetMessageId.slice(0, 8)}`;
  return "-";
}

export default async function SuperAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const data = await getSuperAdminData({ admin: query.admin, action: query.action, from: query.from, to: query.to, user: query.user, request: query.request, offer: query.offer, page });
  const queryString = new URLSearchParams(Object.entries(query).filter((entry): entry is [string, string] => Boolean(entry[1]) && entry[0] !== "page")).toString();
  return <div className="dashboard-page">
    <header className="dashboard-page-header compact"><div><span className="eyebrow">Owner</span><h1>Sistem Yönetimi</h1><p>Admin hesaplarını ve önemli yönetim işlemlerini merkezi olarak incele.</p></div><Link className="button-quiet" href="/admin">Admin paneline dön</Link></header>
    <section className="dashboard-stat-grid admin-stat-grid"><article className="dashboard-stat-card"><span className="dashboard-stat-label">Yaptırım</span><strong>{data.stats.strikeCount}</strong></article><article className="dashboard-stat-card"><span className="dashboard-stat-label">Ban / hesap işlemi</span><strong>{data.stats.moderationCount}</strong></article><article className="dashboard-stat-card"><span className="dashboard-stat-label">İncelenen rapor</span><strong>{data.stats.reportCount}</strong></article><article className="dashboard-stat-card"><span className="dashboard-stat-label">İncelenen mesaj</span><strong>{data.stats.messageCount}</strong></article></section>
    <section className="dashboard-panel-section"><div className="dashboard-section-heading"><div><span className="eyebrow">Yetkili hesaplar</span><h2>Adminler</h2></div></div><SuperAdminCreateForm /><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Oluşturulma</th><th>Son giriş</th><th>Durum</th><th>Aksiyon</th></tr></thead><tbody>{data.admins.map((admin) => <tr key={admin.id}><td>{admin.username}</td><td>{admin.userRoles.map(({ role }) => role.name).join(", ")}</td><td>{formatDate(admin.createdAt.toISOString())}</td><td>{admin.sessions[0] ? formatDate(admin.sessions[0].createdAt.toISOString()) : "-"}</td><td>{admin.isActive ? "Aktif" : "Pasif"}</td><td>{admin.userRoles.some(({ role }) => role.name === "SUPER_ADMIN") ? "Owner" : <><Link className="admin-row-link" href={`/admin/super/${admin.id}`}>Profil →</Link> <SuperAdminControls id={admin.id} isActive={admin.isActive} /></>}</td></tr>)}</tbody></table></div></section>
    <section className="dashboard-panel-section"><div className="dashboard-section-heading"><div><span className="eyebrow">Denetim</span><h2>Admin İşlem Geçmişi</h2></div></div><form className="admin-toolbar admin-toolbar-wide" method="get"><select name="admin" defaultValue={query.admin ?? ""}><option value="">Tüm adminler</option>{data.admins.map((admin) => <option key={admin.id} value={admin.id}>{admin.username}</option>)}</select><select name="action" defaultValue={query.action ?? ""}><option value="">Tüm işlem türleri</option>{data.actions.map((action) => <option key={action} value={action}>{actionLabels[action] ?? action}</option>)}</select><input name="from" type="date" defaultValue={query.from ?? ""} /><input name="to" type="date" defaultValue={query.to ?? ""} /><input name="user" placeholder="Kullanıcı ID" defaultValue={query.user ?? ""} /><input name="request" placeholder="Talep ID" defaultValue={query.request ?? ""} /><input name="offer" placeholder="Teklif ID" defaultValue={query.offer ?? ""} /><button className="button-primary" type="submit">Filtrele</button></form>{data.logs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tarih</th><th>Admin</th><th>İşlem</th><th>Hedef</th><th>Sebep</th></tr></thead><tbody>{data.logs.map((log) => <tr key={log.id}><td>{formatDate(log.createdAt.toISOString())}</td><td>{log.admin.username}</td><td>{actionLabels[log.action] ?? log.action}</td><td>{targetLabel(log)}</td><td>{log.reason ?? "-"}</td></tr>)}</tbody></table></div> : <div className="dashboard-empty-state"><h3>İşlem kaydı bulunamadı.</h3><p>Seçili filtrelerde audit kaydı yok.</p></div>}<AdminPagination page={data.page} total={data.total} pageSize={data.pageSize} basePath="/admin/super" query={queryString} /></section>
  </div>;
}
