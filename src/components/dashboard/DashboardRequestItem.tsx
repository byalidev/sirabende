import Link from "next/link";
import type { RequestView } from "../../server/requests/repository";

const statusLabels = { ACTIVE: "Aktif", CLOSED: "Kapalı", COMPLETED: "Tamamlandı", EXPIRED: "Süresi doldu", CANCELLED: "İptal edildi" } as const;

function formatBudget(value: string | null) {
  return value ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value)) : null;
}

export function DashboardRequestItem({ request }: { request: RequestView }) {
  const min = formatBudget(request.minBudget);
  const max = formatBudget(request.maxBudget);
  const budget = min && max ? `${min} - ${max} TL` : max ? `${max} TL'ye kadar` : "Bütçe açık";
  return <Link className="dashboard-list-item" href={`/talepler/${request.id}`}><span className="dashboard-list-item-main"><span className="dashboard-list-item-title">{request.title}</span><span>{request.category?.name ?? "Kategori yok"} · {request.city}{request.district ? ` / ${request.district}` : ""}</span></span><span className="dashboard-list-item-meta"><strong>{budget}</strong><span className={`dashboard-status dashboard-status-${request.status.toLowerCase()}`}>{statusLabels[request.status]}</span><small>{request.offerCount} teklif</small></span></Link>;
}
