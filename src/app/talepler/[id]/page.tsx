import { RequestCondition } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../components/layout/Container";
import { OfferForm } from "../../../components/offers/OfferForm";
import { OfferList } from "../../../components/offers/OfferList";
import { FavoriteToggle } from "../../../components/trust/FavoriteToggle";
import { ReportForm } from "../../../components/trust/ReportForm";
import { rankOffersForRequest } from "../../../server/matching";
import { isRequestFavorited } from "../../../server/favorites/repository";
import { getCurrentUser } from "../../../server/auth/auth";
import { RequestFeatureBadges } from "../../../components/requests/RequestFeatureBadges";
import { requestMatchFeatureLabels } from "../../../components/request/requestData";
import { getRequestById } from "../../../server/requests/repository";

const conditionLabels: Record<RequestCondition, string> = {
  NEW: "Sıfır",
  USED: "İkinci El",
  REFURBISHED: "Yenilenmiş",
  UNKNOWN: "Fark Etmez",
};

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date(value)) : "Belirtilmedi";
}

function formatBudget(value: string | null) {
  return value ? `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value))} TL` : null;
}

function budgetLabel(minBudget: string | null, maxBudget: string | null) {
  const min = formatBudget(minBudget);
  const max = formatBudget(maxBudget);
  if (min && max) return `${min} - ${max}`;
  if (max) return `${max}'ye kadar`;
  if (min) return `${min}'den başlayan`;
  return "Bütçe belirtilmedi";
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();

  const request = await getRequestById(id);
  if (!request) notFound();
  const offers = await rankOffersForRequest(request);
  const user = await getCurrentUser();
  const favorited = user ? await isRequestFavorited(user.id, id) : false;
  const canOffer = request.status === "ACTIVE" && (!request.expiresAt || new Date(request.expiresAt) > new Date());

  return (
    <div className="request-detail-page">
      <main>
        <section className="request-detail-hero"><Container><Link className="back-link" href="/talepler">← Tüm taleplere dön</Link><div className="request-detail-badge"><span className="request-badge">Alıcı talebi</span><span>Aktif</span></div><RequestFeatureBadges isFeatured={request.isFeatured} isPinned={request.isPinned} isUrgent={request.isUrgent} isSameDayNeeded={request.sameDayNeeded} /><h1>{request.title}</h1><p>{request.city}{request.district ? ` / ${request.district}` : ""} · {request.category?.name ?? "Kategori belirtilmedi"}</p><div className="request-detail-actions"><FavoriteToggle requestId={request.id} initialFavorited={favorited} /><ReportForm targetType="REQUEST" targetId={request.id} /></div></Container></section>
        <Container>
          <div className="request-detail-layout">
            <div className="request-detail-main">
              <div className="request-detail-card-header">
                <div>
                  <span className="eyebrow">{request.user.username} talebi</span>
                  <h2 className="request-detail-section-title">Talep bilgileri</h2>
                </div>
              </div>
              <article className="request-detail-card">
                <div className="request-detail-facts"><div><span>Bütçe</span><strong>{budgetLabel(request.minBudget, request.maxBudget)}</strong></div><div><span>Ürün durumu</span><strong>{conditionLabels[request.condition]}</strong></div><div><span>Konum</span><strong>{request.city}{request.district ? ` / ${request.district}` : ""}</strong></div><div><span>Kategori</span><strong>{request.category?.name ?? "Belirtilmedi"}</strong></div></div>
                <div className="request-detail-copy"><p>{request.description || "Bu talep için açıklama eklenmedi."}</p></div>
                {request.preferredFeatures && request.preferredFeatures.length > 0 ? (
                  <div className="request-detail-features">
                    <span className="request-preview-feature-label">Eşleşme kriterleri</span>
                    <div className="request-feature-list">
                      {request.preferredFeatures.map((feature) => (
                        <span key={feature}>{requestMatchFeatureLabels[feature] ?? feature}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="request-detail-dates"><span>Oluşturulma <strong>{formatDate(request.createdAt)}</strong></span><span>Son geçerlilik <strong>{formatDate(request.expiresAt)}</strong></span></div>
              </article>
            </div>
            <aside className="request-detail-side"><OfferList offers={offers} /></aside>
            <div className="request-detail-form-panel"><span className="eyebrow">Satıcıysan</span><h2>Bu talep için uygun bir seçeneğin mi var?</h2><p>Fiyatını, ürün detaylarını ve teslimat şeklini paylaş.</p><OfferForm requestId={request.id} canOffer={canOffer} /><Link className="button-quiet" href="/talepler">Diğer taleplere bak ↗</Link></div>
          </div>
        </Container>
      </main>
    </div>
  );
}
