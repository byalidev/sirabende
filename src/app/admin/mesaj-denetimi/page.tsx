import Link from "next/link";
import { AdminPagination, formatDate } from "../../../components/admin/AdminPageParts";
import { getAdminMessageModeration, type MessageModerationFilter } from "../../../server/admin/message-moderation";

const filters: Array<{ value: MessageModerationFilter; label: string }> = [
  { value: "ALL", label: "Tümü" },
  { value: "NORMAL", label: "Normal" },
  { value: "PENDING", label: "İnceleme bekleyen" },
  { value: "REPORTED", label: "Raporlu" },
  { value: "PROFANITY", label: "Küfür / Hakaret" },
  { value: "PHONE_NUMBER", label: "Telefon numarası" },
  { value: "BANKING", label: "IBAN / Bankacılık" },
  { value: "EXTERNAL_CONTACT", label: "Platform dışı iletişim" },
  { value: "SUSPICIOUS_CONTENT", label: "Şüpheli içerik" },
];

export default async function AdminMessageModerationPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> }) {
  const query = await searchParams;
  const filter = filters.some((item) => item.value === query.filter) ? query.filter as MessageModerationFilter : "ALL";
  const page = Math.max(1, Number(query.page) || 1);
  const data = await getAdminMessageModeration(filter, page);
  const queryString = filter !== "ALL" ? `filter=${filter}` : "";
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Güvenlik merkezi</span><h1>Mesaj Denetimi</h1><p>Mesajları otomatik işaretlere göre incele. Hiçbir işaret otomatik yaptırım uygulamaz.</p></div></header><nav className="dashboard-filter-tabs" aria-label="Mesaj denetimi filtreleri">{filters.map((item) => <Link className={filter === item.value ? "active" : ""} href={item.value === "ALL" ? "/admin/mesaj-denetimi" : `/admin/mesaj-denetimi?filter=${item.value}`} key={item.value}>{item.label}</Link>)}</nav>{data.rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Konuşma</th><th>Katılımcılar</th><th>Son mesaj</th><th>Tarih</th><th>İşaretler</th><th>Durum</th><th /></tr></thead><tbody>{data.rows.map((row) => <tr key={row.id}><td><code>{row.id.slice(0, 8)}</code></td><td>{row.participants}</td><td className="message-moderation-preview">{row.lastMessage}</td><td>{formatDate(row.lastMessageAt)}</td><td>{row.flags.length ? row.flags.map((flag) => <span className={`moderation-flag-chip ${flag.severity.toLowerCase()}`} key={flag.id}>{flag.type}</span>) : "-"}</td><td>{row.reviewStatus}</td><td><Link className="admin-row-link" href={`/admin/mesaj-denetimi/${row.id}`}>Detay →</Link></td></tr>)}</tbody></table></div> : <div className="dashboard-empty-state"><h3>İncelenecek konuşma yok.</h3><p>Bu filtrede mesaj bulunmuyor.</p></div>}<AdminPagination page={data.page} total={data.total} pageSize={data.pageSize} basePath="/admin/mesaj-denetimi" query={queryString} /></div>;
}
