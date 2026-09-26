import type { TrustScore } from "../../server/strikes/repository";

const statusClass: Record<TrustScore["status"], string> = { "Güvenli": "safe", "Dikkatli": "caution", "Riskli": "risky" };

export function TrustScoreBadge({ trustScore, label = "Üye Puanı" }: { trustScore: TrustScore; label?: string }) {
  return (
    <div className={`trust-score-badge ${statusClass[trustScore.status]}`} aria-label="Üye puanı ve risk durumu">
      <span className="trust-score-badge-label">{label}</span>
      <span className="trust-score-value">{trustScore.score}</span>
      <span className="trust-score-status">{trustScore.status}</span>
    </div>
  );
}
