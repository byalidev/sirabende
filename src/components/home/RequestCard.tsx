import { FavoriteToggle } from "../trust/FavoriteToggle";
import { MatchMeter } from "../ui/MatchMeter";

type RequestCardProps = {
  title: string;
  location: string;
  budget: string;
  condition: string;
  offers: number;
  description: string;
  category?: string;
  href?: string;
  requestId?: string;
  isFavorited?: boolean;
  createdAt?: string;
  matchScore?: number;
  matchReasons?: string[];
};

function formatDate(value?: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(value));
}

export function RequestCard({ title, location, budget, condition, offers, description, category, href, requestId, isFavorited, createdAt, matchScore, matchReasons }: RequestCardProps) {
  const dateLabel = formatDate(createdAt);
  return (
    <article className="request-card">
      <div>
        <div className="request-card-top">
          <span className="request-badge">{category || "Alıcı talebi"}</span>
          {requestId ? <FavoriteToggle requestId={requestId} initialFavorited={isFavorited} /> : <span className="card-arrow" aria-hidden="true">→</span>}
        </div>
        <h3>{href ? <a className="request-card-link" href={href}>{title}</a> : title}</h3>
        <p className="request-description">{description}</p>
        {matchScore !== undefined ? <MatchMeter score={matchScore} reasons={matchReasons} /> : null}
      </div>
      <div className="request-card-meta">
        <span>{location}</span>
        <span>{condition}</span>
        {dateLabel ? <span>{dateLabel}</span> : null}
      </div>
      <div className="request-card-footer">
        <strong>{budget}</strong>
        <span>{offers} teklif</span>
      </div>
    </article>
  );
}
