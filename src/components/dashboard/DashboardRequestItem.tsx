import Link from "next/link";
import type { RequestView } from "../../server/requests/repository";
import { DeleteButton } from "./DeleteButton";
import { RequestVisibilityControls } from "./RequestVisibilityControls";

const statusLabels = { ACTIVE: "Aktif", CLOSED: "Kapalı", COMPLETED: "Tamamlandı", EXPIRED: "Süresi doldu", CANCELLED: "İptal edildi" } as const;

function formatBudget(value: string | null) {
  return value ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value)) : null;
}

export function DashboardRequestItem({ request }: { request: RequestView }) {
  const min = formatBudget(request.minBudget);
  const max = formatBudget(request.maxBudget);
  const budget = min && max ? `${min} - ${max} TL` : max ? `${max} TL'ye kadar` : "Bütçe açık";
  return <div className="dashboard-list-item"><div className="dashboard-list-item-owner"><Link className="dashboard-list-item-main" href={`/talepler/${request.id}`}><span className="dashboard-list-item-title">{request.title}</span><span>{request.category?.name ?? "Kategori yok"} · {request.city}{request.district ? ` / ${request.district}` : ""}</span></Link><RequestVisibilityControls request={request} /></div><span className="dashboard-list-item-meta"><strong>{budget}</strong><span className={`dashboard-status dashboard-status-${request.status.toLowerCase()}`}>{statusLabels[request.status]}</span><small>{request.offerCount} teklif</small><DeleteButton endpoint={`/api/requests/${request.id}`} label="Bu talep" /></span></div>;
}
