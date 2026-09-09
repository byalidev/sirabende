import { Prisma } from "@prisma/client";

export class ReviewValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

export function validateReviewInput(input: unknown) {
  if (!input || typeof input !== "object") throw new ReviewValidationError("Geçersiz değerlendirme verisi.");
  const body = input as { rating?: unknown; comment?: unknown };
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim().replace(/\s+/g, " ") : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new ReviewValidationError("Puan 1 ile 5 arasında tam sayı olmalı.");
  if (comment.length > 1000) throw new ReviewValidationError("Yorum 1.000 karakteri geçemez.");
  return { rating, comment: comment || null };
}

export function isPrismaUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
