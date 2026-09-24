type RequestFeatureBadgesProps = {
  isFeatured?: boolean;
  isPinned?: boolean;
  isUrgent?: boolean;
  isSameDayNeeded?: boolean;
};

export function RequestFeatureBadges({ isFeatured = false, isPinned = false, isUrgent = false, isSameDayNeeded = false }: RequestFeatureBadgesProps) {
  if (!isFeatured && !isPinned && !isUrgent && !isSameDayNeeded) return null;
  return <div className="request-feature-badges" aria-label="Talep görünürlük durumları">
    {isUrgent ? <span className="request-feature-badge urgent"><span className="request-feature-badge-icon" aria-hidden="true">⏰</span>Acil</span> : null}
    {isSameDayNeeded ? <span className="request-feature-badge sameday"><span className="request-feature-badge-icon" aria-hidden="true">🕒</span>Aynı Gün Lazım</span> : null}
    {isFeatured ? <span className="request-feature-badge featured"><span className="request-feature-badge-icon" aria-hidden="true">★</span>Öne Çıkan</span> : null}
    {isPinned ? <span className="request-feature-badge pinned"><span className="request-feature-badge-icon" aria-hidden="true">📍</span>Sabit</span> : null}
  </div>;
}