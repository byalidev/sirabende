import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/DashboardEmptyState";
import { DashboardRequestItem } from "../../../components/dashboard/DashboardRequestItem";
import { getRequestActor } from "../../../server/requests/actor";
import { getRequestsByOwner, type OwnerRequestFilter } from "../../../server/requests/repository";

const filters: Array<{ value: OwnerRequestFilter; label: string }> = [
  { value: "ALL", label: "Tümü" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "EXPIRED", label: "Süresi dolmuş" },
  { value: "CLOSED", label: "Kapalı" },
];

function getFilter(value: string | string[] | undefined): OwnerRequestFilter {
  const candidate = Array.isArray(value) ? value[0] : value;
  return filters.some((filter) => filter.value === candidate) ? candidate as OwnerRequestFilter : "ALL";
}

export default async function MyRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string | string[] }> }) {
  const query = await searchParams;
  const filter = getFilter(query.status);
  const actor = await getRequestActor();
  const requests = await getRequestsByOwner(actor.id, filter);

  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Kayıtların</span><h1>Taleplerim</h1><p>Oluşturduğun tüm talepleri buradan takip edebilirsin.</p></div><Link className="button-primary" href="/talep-olustur">Yeni talep ↗</Link></header><nav className="dashboard-filter-tabs" aria-label="Talep durumu filtreleri">{filters.map((item) => <Link className={filter === item.value ? "active" : ""} href={item.value === "ALL" ? "/panel/talepler" : `/panel/talepler?status=${item.value}`} key={item.value}>{item.label}</Link>)}</nav>{requests.length ? <div className="dashboard-list dashboard-list-wide">{requests.map((request) => <DashboardRequestItem request={request} key={request.id} />)}</div> : <DashboardEmptyState title={filter === "ALL" ? "Henüz bir talep oluşturmadın." : "Bu filtrede talep yok."} description="İhtiyacını anlat, teklifler sana gelsin." href="/talep-olustur" action="Talep oluştur" />}</div>;
}
