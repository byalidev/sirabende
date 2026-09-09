export class MessageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageValidationError";
  }
}

export function validateMessageContent(input: unknown) {
  if (!input || typeof input !== "object") throw new MessageValidationError("Geçersiz mesaj verisi.");
  const content = (input as { content?: unknown }).content;
  if (typeof content !== "string") throw new MessageValidationError("Mesaj zorunludur.");
  const normalized = content.trim().replace(/\s+/g, " ");
  if (!normalized) throw new MessageValidationError("Boş mesaj gönderilemez.");
  if (normalized.length > 2000) throw new MessageValidationError("Mesaj 2.000 karakteri geçemez.");
  return normalized;
}
