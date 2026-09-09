import Link from "next/link";
import { RequestCard } from "../../../components/home/RequestCard";
import { DashboardEmptyState } from "../../../components/dashboard/DashboardEmptyState";
import { getRequestActor } from "../../../server/requests/actor";
import { getFavoriteRequests } from "../../../server/favorites/repository";
import { getActiveRequestsByIds } from "../../../server/requests/repository";

function budgetLabel(min: string | null, max: string | null) {
  const format = (value: string | null) => value ? new Intl.NumberFormat("tr-TR").format(Number(value)) : null;
  const low = format(min);
  const high = format(max);
  return low && high ? `${low} - ${high} TL` : high ? `${high} TL'ye kadar` : "Bütçe açık";
}

const conditions = { NEW: "Sıfır", USED: "İkinci El", REFURBISHED: "Yenilenmiş", UNKNOWN: "Fark Etmez" } as const;

export default async function FavoriteRequestsPage() {
  const actor = await getRequestActor();
  const favoriteRows = await getFavoriteRequests(actor.id);
  const requests = await getActiveRequestsByIds(favoriteRows.map((row) => row.requestId));
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Kaydettiklerin</span><h1>Favorilerim</h1><p>İlgini çeken aktif talepleri burada bulabilirsin.</p></div><Link className="button-quiet" href="/talepler">Talepleri keşfet ↗</Link></header>{requests.length ? <div className="request-grid">{requests.map((request) => <RequestCard key={request.id} requestId={request.id} isFavorited title={request.title} location={`${request.city}${request.district ? ` / ${request.district}` : ""}`} budget={budgetLabel(request.minBudget, request.maxBudget)} condition={conditions[request.condition]} offers={request.offerCount} description={request.description ?? "Detay verilmedi."} category={request.category?.name} href={`/talepler/${request.id}`} />)}</div> : <DashboardEmptyState title="Henüz favorin yok." description="İlgini çeken talepleri kaydet, sonra kolayca geri dön." href="/talepler" action="Talep keşfet" />}</div>;
}
