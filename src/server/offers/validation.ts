import { Prisma } from "@prisma/client";

export type CreateOfferInput = {
  price: string | number;
  description: string;
  deliveryInfo?: string | null;
};

export type ValidatedOfferInput = {
  price: Prisma.Decimal;
  description: string;
  deliveryInfo: string | null;
};

export class OfferValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OfferValidationError";
  }
}

export class OfferDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OfferDomainError";
  }
}

function parsePrice(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new OfferValidationError("Teklif fiyatı geçerli bir tutar olmalı.");
  }

  const input = String(value).trim().replace(/\s/g, "");
  if (!/^\d[\d.]*([,]\d{1,2})?$/.test(input)) {
    throw new OfferValidationError("Teklif fiyatı geçerli bir tutar olmalı.");
  }

  const price = new Prisma.Decimal(input.replace(/\./g, "").replace(",", "."));
  if (price.lessThanOrEqualTo(0) || price.greaterThan(100000000)) {
    throw new OfferValidationError("Teklif fiyatı 0 ile 100.000.000 TL arasında olmalı.");
  }

  return price;
}

export function validateCreateOffer(input: unknown): ValidatedOfferInput {
  if (!input || typeof input !== "object") {
    throw new OfferValidationError("Geçersiz teklif verisi.");
  }

  const body = input as Partial<CreateOfferInput>;
  const description = typeof body.description === "string"
    ? body.description.trim().replace(/\s+/g, " ")
    : "";
  const deliveryInfo = typeof body.deliveryInfo === "string"
    ? body.deliveryInfo.trim().replace(/\s+/g, " ")
    : null;

  if (description.length < 10 || description.length > 2000) {
    throw new OfferValidationError("Teklif açıklaması 10-2.000 karakter arasında olmalı.");
  }
  if (deliveryInfo && deliveryInfo.length > 200) {
    throw new OfferValidationError("Teslimat bilgisi 200 karakteri geçemez.");
  }

  return {
    price: parsePrice(body.price),
    description,
    deliveryInfo: deliveryInfo || null,
  };
}
