import { AdminPagination, formatDate } from "../../../components/admin/AdminPageParts";
import { getAdminPageFeedback } from "../../../server/feedback/repository";

export default async function AdminFeedbackPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const data = await getAdminPageFeedback(page);
  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header compact">
        <div>
          <span className="eyebrow">Geri Bildirim</span>
          <h1>Geri Bildirimler</h1>
          <p>Kullanıcıların sayfalar hakkında bıraktığı AI geri bildirimlerini incele.</p>
        </div>
      </header>
      {data.rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Gönderen</th>
                <th>Sayfa</th>
                <th>Mesaj</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.user?.username ?? "Ziyaretçi"}</td>
                  <td>{row.pageUrl}</td>
                  <td>{row.message}</td>
                  <td>{formatDate(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dashboard-empty-state">
          <h3>Henüz geri bildirim yok.</h3>
          <p>Gönderilen geri bildirimler burada görünecek.</p>
        </div>
      )}
      <AdminPagination page={data.page} total={data.total} pageSize={data.pageSize} basePath="/admin/geri-bildirim" />
    </div>
  );
}
