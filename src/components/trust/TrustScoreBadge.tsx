import type { TrustScore } from "../../server/strikes/repository";

const statusClass: Record<TrustScore["status"], string> = { "Güvenli": "safe", "Dikkatli": "caution", "Riskli": "risky" };

export function TrustScoreBadge({ trustScore, label = "Üye Puanı" }: { trustScore: TrustScore; label?: string }) {
  return <div className={`trust-score-badge ${statusClass[trustScore.status]}`} aria-label="Üye puanı ve risk durumu">
    <span className="trust-score-value">{label}: {trustScore.score}</span>
    <span className="trust-score-status">Durum: {trustScore.status}</span>
  </div>;
}
