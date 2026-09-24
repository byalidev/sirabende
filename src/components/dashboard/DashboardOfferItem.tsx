import Link from "next/link";
import type { OwnedOfferView } from "../../server/offers/repository";
import { DeleteButton } from "./DeleteButton";

const statusLabels = { PENDING: "Beklemede", ACCEPTED: "Kabul edildi", REJECTED: "Reddedildi", WITHDRAWN: "Geri çekildi", EXPIRED: "Süresi doldu" } as const;

export function DashboardOfferItem({ offer }: { offer: OwnedOfferView }) {
  return <div className="dashboard-list-item"><span className="dashboard-list-item-main"><span className="dashboard-list-item-title">{offer.requestTitle}</span><span>{offer.description || "Açıklama eklenmedi"}</span></span><span className="dashboard-list-item-meta"><strong>{new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(offer.price))} TL</strong><span className={`dashboard-status dashboard-status-${offer.status.toLowerCase()}`}>{statusLabels[offer.status]}</span><Link href={`/talepler/${offer.requestId}`}>Talebi gör ↗</Link><DeleteButton endpoint={`/api/offers/${offer.id}`} label="Bu teklif" /></span></div>;
}
