export type StrikeLevelName = "LOW" | "MEDIUM" | "HIGH";

const suspensionThresholds: Record<StrikeLevelName, number> = { LOW: 20, MEDIUM: 10, HIGH: 3 };

export type TrustRiskStatus = "Güvenli" | "Dikkatli" | "Riskli";
export type TrustScore = { score: number; status: TrustRiskStatus };

const trustScoreStart = 100;
const strikePenalties: Record<StrikeLevelName, number> = { LOW: 5, MEDIUM: 15, HIGH: 30 };

// Score is derived from currently active strikes only, so revoking a strike restores the score automatically.
export function computeTrustScore(activeStrikeCounts: Record<StrikeLevelName, number>): TrustScore {
  const totalPenalty = activeStrikeCounts.LOW * strikePenalties.LOW + activeStrikeCounts.MEDIUM * strikePenalties.MEDIUM + activeStrikeCounts.HIGH * strikePenalties.HIGH;
  const score = Math.max(0, trustScoreStart - totalPenalty);
  const status: TrustRiskStatus = score >= 80 ? "Güvenli" : score >= 50 ? "Dikkatli" : "Riskli";
  return { score, status };
}

export function getStrikeWarningLevel(counts: { lowStrikeCount: number; mediumStrikeCount: number; highStrikeCount: number }): StrikeLevelName | null {
  if (counts.highStrikeCount >= 1) return "HIGH";
  if (counts.mediumStrikeCount >= 3) return "MEDIUM";
  if (counts.lowStrikeCount >= 4) return "LOW";
  return null;
}

export function reachesStrikeSuspensionThreshold(level: StrikeLevelName, count: number) {
  return count >= suspensionThresholds[level];
}
