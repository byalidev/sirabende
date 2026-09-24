import Link from "next/link";
import { AdminPagination, formatDate } from "../../../components/admin/AdminPageParts";
import { getAdminUsers } from "../../../server/admin/repository";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const query = await searchParams;
  const search = query.search ?? "";
  const page = Math.max(1, Number(query.page) || 1);
  const data = await getAdminUsers(search, page);
  const paginationQuery = new URLSearchParams({ ...(search ? { search } : {}) }).toString();
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Platform</span><h1>Kullanıcılar</h1><p>Üyeleri, rollerini ve aktivitelerini incele.</p></div></header><form className="admin-toolbar" method="get"><input name="search" defaultValue={search} placeholder="Kullanıcı adı veya email ara" aria-label="Kullanıcı ara" /><button className="button-primary" type="submit">Ara</button></form>{data.rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Kullanıcı</th><th>Roller</th><th>Aktivite</th><th>Durum</th><th>Kayıt</th><th /></tr></thead><tbody>{data.rows.map((user) => <tr key={user.id}><td><strong>{user.username}</strong><small>{user.email}</small></td><td>{user.roles.length ? user.roles.join(", ") : "USER"}</td><td>{user.requestCount} talep · {user.offerCount} teklif · {user.reviewCount} review</td><td><span className={`admin-active-dot ${user.isActive ? "active" : "inactive"}`} />{user.permanentlySuspendedAt ? "Kalıcı kapatıldı" : user.isActive ? "Aktif" : "Pasif"}</td><td>{formatDate(user.createdAt)}</td><td><Link className="admin-row-link" href={`/admin/kullanicilar/${user.id}`}>Detay →</Link></td></tr>)}</tbody></table></div> : <div className="dashboard-empty-state"><h3>Kullanıcı bulunamadı.</h3><p>Arama ölçütlerini değiştirerek tekrar dene.</p></div>}<AdminPagination page={data.page} total={data.total} pageSize={data.pageSize} basePath="/admin/kullanicilar" query={paginationQuery} /></div>;
}
