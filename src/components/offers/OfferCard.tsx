import type { OfferView } from "../../server/offers/repository";
import { OfferContactButton } from "./OfferContactButton";
import { BlockToggle } from "../trust/BlockToggle";
import { ReportForm } from "../trust/ReportForm";
import { ReviewForm } from "../trust/ReviewForm";
import { MatchMeter } from "../ui/MatchMeter";

type OfferCardOffer = OfferView & {
  matchScore?: number;
  matchReasons?: string[];
  seller?: { id: string; username: string };
  averageRating?: number;
  reviewCount?: number;
  trustScore?: number | null;
};

const statusLabels = {
  PENDING: "Beklemede",
  ACCEPTED: "Kabul edildi",
  REJECTED: "Reddedildi",
  WITHDRAWN: "Geri çekildi",
  EXPIRED: "Süresi doldu",
} as const;

const conditionLabels = {
  NEW: "Sıfır",
  USED: "İkinci El",
  REFURBISHED: "Yenilenmiş",
  UNKNOWN: "Fark Etmez",
} as const;

const warrantyLabels = {
  NONE: "Garanti yok",
  SELLER: "Satıcı garantisi",
  MANUFACTURER: "Üretici garantisi",
  STORE: "Mağaza garantisi",
} as const;

const benefitLabels: Record<string, string> = {
  BOX_INCLUDED: "Kutu dahil",
  INVOICE: "Fatura var",
  FAST_DELIVERY: "Hızlı teslim",
  SHIPPING_INCLUDED: "Kargo dahil",
  CERTIFIED: "Kontrol edilmiş",
  PAYMENT_PLAN: "Taksit imkanı",
};

function formatPrice(value: string, currency: string) {
  const currencyLabel = currency === "TRY" ? "TL" : currency;
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value))} ${currencyLabel}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

export function OfferCard({ offer }: { offer: OfferCardOffer }) {
  const reviewText = offer.reviewCount ? `${(offer.averageRating ?? 0).toFixed(1)}★ · ${offer.reviewCount} değerlendirme` : "Yeni satıcı";

  return (
    <article className="offer-card">
      <div className="offer-card-top">
        <div>
          <span className="offer-label">Satıcı teklifi</span>
          <strong className="offer-price">{formatPrice(offer.price, offer.currency)}</strong>
        </div>
        <span className={`offer-status offer-status-${offer.status.toLowerCase()}`}>{statusLabels[offer.status]}</span>
      </div>
      <div className="offer-meta-row">
        <span>{offer.seller?.username ? `${offer.seller.username}` : "Satıcı"}</span>
        <span>{reviewText}</span>
        {offer.trustScore !== null && offer.trustScore !== undefined ? <span>Üye puanı: {offer.trustScore}</span> : null}
      </div>
      <div className="offer-detail-list">
        <span><strong>Durum:</strong> {conditionLabels[offer.condition ?? "UNKNOWN"]}</span>
        <span><strong>Garanti:</strong> {warrantyLabels[offer.warrantyType ?? "NONE"]}{offer.warrantyMonths ? ` · ${offer.warrantyMonths} ay` : ""}</span>
        {offer.benefits?.length ? <span><strong>Avantajlar:</strong> {offer.benefits.map((item) => benefitLabels[item] ?? item).join(" · ")}</span> : null}
      </div>
      {offer.matchScore !== undefined ? <MatchMeter score={offer.matchScore} reasons={offer.matchReasons} /> : null}
      {offer.description ? <p>{offer.description}</p> : null}
      {offer.status === "PENDING" || offer.status === "ACCEPTED" ? <OfferContactButton offerId={offer.id} /> : null}
      <div className="offer-trust-actions"><ReportForm targetType="OFFER" targetId={offer.id} /><BlockToggle userId={offer.sellerId} />{offer.status === "ACCEPTED" ? <ReviewForm offerId={offer.id} /> : null}</div>
    </article>
  );
}
