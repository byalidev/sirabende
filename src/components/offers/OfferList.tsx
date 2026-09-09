import type { OfferView } from "../../server/offers/repository";
import { OfferCard } from "./OfferCard";

type ListedOffer = OfferView & { matchScore?: number; matchReasons?: string[] };

export function OfferList({ offers }: { offers: ListedOffer[] }) {
  return (
    <section className="offers-section" aria-labelledby="offers-heading">
      <div className="offers-section-heading">
        <div>
          <span className="eyebrow">Karşılaştır</span>
          <h2 id="offers-heading">Gelen Teklifler</h2>
        </div>
        <span className="offers-count">{offers.length} teklif</span>
      </div>
      {offers.length > 0 ? (
        <div className="offer-list">{offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div>
      ) : (
        <div className="offers-empty">
          <span className="offers-empty-icon">＋</span>
          <h3>Henüz teklif yok.</h3>
          <p>İlk teklif geldiğinde burada görünecek.</p>
        </div>
      )}
    </section>
  );
}
