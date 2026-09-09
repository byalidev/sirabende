import type { OfferView } from "../../server/offers/repository";
import { OfferContactButton } from "./OfferContactButton";
import { BlockToggle } from "../trust/BlockToggle";
import { ReportForm } from "../trust/ReportForm";
import { ReviewForm } from "../trust/ReviewForm";
import { MatchMeter } from "../ui/MatchMeter";

type OfferCardOffer = OfferView & { matchScore?: number; matchReasons?: string[] };

const statusLabels = {
  PENDING: "Beklemede",
  ACCEPTED: "Kabul edildi",
  REJECTED: "Reddedildi",
  WITHDRAWN: "Geri çekildi",
  EXPIRED: "Süresi doldu",
} as const;

function formatPrice(value: string, currency: string) {
  const currencyLabel = currency === "TRY" ? "TL" : currency;
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(Number(value))} ${currencyLabel}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

export function OfferCard({ offer }: { offer: OfferCardOffer }) {
  return (
    <article className="offer-card">
      <div className="offer-card-top">
        <div>
          <span className="offer-label">Satıcı teklifi</span>
          <strong className="offer-price">{formatPrice(offer.price, offer.currency)}</strong>
        </div>
        <span className={`offer-status offer-status-${offer.status.toLowerCase()}`}>{statusLabels[offer.status]}</span>
      </div>
      {offer.matchScore !== undefined ? <MatchMeter score={offer.matchScore} reasons={offer.matchReasons} /> : null}
      {offer.description ? <p>{offer.description}</p> : null}
      <div className="offer-card-footer">
        <span>{offer.deliveryInfo || "Teslimat bilgisi belirtilmedi"}</span>
        <time dateTime={offer.createdAt}>{formatDate(offer.createdAt)}</time>
      </div>
      {offer.status === "PENDING" || offer.status === "ACCEPTED" ? <OfferContactButton offerId={offer.id} /> : null}
      <div className="offer-trust-actions"><ReportForm targetType="OFFER" targetId={offer.id} /><ReportForm targetType="USER" targetId={offer.sellerId} /><BlockToggle userId={offer.sellerId} />{offer.status === "ACCEPTED" ? <ReviewForm offerId={offer.id} /> : null}</div>
    </article>
  );
}
