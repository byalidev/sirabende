import Link from "next/link";
import { DashboardEmptyState } from "../../../components/dashboard/DashboardEmptyState";
import { DashboardOfferItem } from "../../../components/dashboard/DashboardOfferItem";
import { getRequestActor } from "../../../server/requests/actor";
import { getOffersBySeller } from "../../../server/offers/repository";
import { OfferStatus } from "@prisma/client";

const filters: Array<{ value: OfferStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "Tümü" },
  { value: "PENDING", label: "Bekleyen" },
  { value: "ACCEPTED", label: "Kabul edilen" },
  { value: "REJECTED", label: "Reddedilen" },
  { value: "WITHDRAWN", label: "Geri çekilen" },
  { value: "EXPIRED", label: "Süresi dolmuş" },
];

function getFilter(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return filters.some((filter) => filter.value === candidate) ? candidate as OfferStatus | "ALL" : "ALL";
}

export default async function MyOffersPage({ searchParams }: { searchParams: Promise<{ status?: string | string[] }> }) {
  const query = await searchParams;
  const filter = getFilter(query.status);
  const actor = await getRequestActor();
  const offers = await getOffersBySeller(actor.id, filter === "ALL" ? undefined : filter);

  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Satıcı hareketlerin</span><h1>Tekliflerim</h1><p>Verdiğin tekliflerin durumunu ve bağlı talepleri takip et.</p></div><Link className="button-quiet" href="/talepler">Talep keşfet ↗</Link></header><nav className="dashboard-filter-tabs" aria-label="Teklif durumu filtreleri">{filters.map((item) => <Link className={filter === item.value ? "active" : ""} href={item.value === "ALL" ? "/panel/teklifler" : `/panel/teklifler?status=${item.value}`} key={item.value}>{item.label}</Link>)}</nav>{offers.length ? <div className="dashboard-list dashboard-list-wide">{offers.map((offer) => <DashboardOfferItem offer={offer} key={offer.id} />)}</div> : <DashboardEmptyState title={filter === "ALL" ? "Henüz bir teklif vermedin." : "Bu filtrede teklif yok."} description="Aktif talepleri keşfet ve uygun seçeneğini paylaş." href="/talepler" action="Talep keşfet" />}</div>;
}
