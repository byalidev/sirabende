export type ReportTargetType = "USER" | "REQUEST" | "OFFER";

export const reportReasons = ["SPAM", "SCAM_SUSPECTED", "MISLEADING", "INAPPROPRIATE", "OTHER"] as const;
export type ReportReason = (typeof reportReasons)[number];

export class ReportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportValidationError";
  }
}

export function validateReportInput(input: unknown) {
  if (!input || typeof input !== "object") throw new ReportValidationError("Geçersiz şikayet verisi.");
  const body = input as { targetType?: unknown; targetId?: unknown; reason?: unknown; description?: unknown };
  if (!['USER', 'REQUEST', 'OFFER'].includes(String(body.targetType))) throw new ReportValidationError("Geçersiz şikayet hedefi.");
  if (typeof body.targetId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.targetId)) throw new ReportValidationError("Geçersiz hedef bağlantısı.");
  if (!reportReasons.includes(body.reason as ReportReason)) throw new ReportValidationError("Geçersiz şikayet nedeni.");
  const description = typeof body.description === "string" ? body.description.trim().replace(/\s+/g, " ") : null;
  if (description && description.length > 1000) throw new ReportValidationError("Açıklama 1.000 karakteri geçemez.");
  return { targetType: body.targetType as ReportTargetType, targetId: body.targetId, reason: body.reason as ReportReason, description };
}
