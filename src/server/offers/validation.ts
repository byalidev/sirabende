import { Prisma, RequestCondition, OfferWarrantyType } from "@prisma/client";

const OFFER_CONDITIONS = new Set(Object.values(RequestCondition));
const OFFER_WARRANTY_TYPES = new Set(Object.values(OfferWarrantyType));
const OFFER_BENEFITS = [
  "BOX_INCLUDED",
  "INVOICE",
  "FAST_DELIVERY",
  "SHIPPING_INCLUDED",
  "CERTIFIED",
  "PAYMENT_PLAN",
] as const;

export type OfferBenefit = (typeof OFFER_BENEFITS)[number];

export type CreateOfferInput = {
  price: string | number;
  description: string;
  deliveryInfo?: string | null;
  condition?: string;
  warrantyType?: string | null;
  warrantyMonths?: string | number | null;
  benefits?: unknown;
};

export type ValidatedOfferInput = {
  price: Prisma.Decimal;
  description: string;
  deliveryInfo: string | null;
  condition: RequestCondition;
  warrantyType: OfferWarrantyType;
  warrantyMonths: number | null;
  benefits: OfferBenefit[];
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

function parseCondition(value: unknown): RequestCondition {
  if (typeof value !== "string" || !OFFER_CONDITIONS.has(value as RequestCondition)) {
    throw new OfferValidationError("Ürün durumu seçimi geçerli olmalı.");
  }
  return value as RequestCondition;
}

function parseWarrantyType(value: unknown): OfferWarrantyType {
  if (typeof value !== "string" || !OFFER_WARRANTY_TYPES.has(value as OfferWarrantyType)) {
    throw new OfferValidationError("Garanti türü seçimi geçerli olmalı.");
  }
  return value as OfferWarrantyType;
}

function parseWarrantyMonths(type: OfferWarrantyType, value: unknown): number | null {
  if (type === "NONE") {
    return null;
  }

  if (value == null || value === "") return null;

  const numericValue = typeof value === "string" ? Number(value) : Number(value);
  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 120) {
    throw new OfferValidationError("Garanti süresi 1 ile 120 ay arasında olmalı.");
  }

  return numericValue;
}

function parseBenefits(value: unknown): OfferBenefit[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new OfferValidationError("Teklif avantajları bir dizi olmalı.");
  }

  const unique = [...new Set(value.filter((item): item is string => typeof item === "string"))]
    .filter((item): item is OfferBenefit => (OFFER_BENEFITS as readonly string[]).includes(item));

  if (unique.length > 6) {
    throw new OfferValidationError("Teklif avantajı en fazla 6 adet seçilebilir.");
  }

  return unique as OfferBenefit[];
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

  const condition = parseCondition(body.condition ?? "UNKNOWN");
  const warrantyType = parseWarrantyType(body.warrantyType ?? "NONE");
  const warrantyMonths = parseWarrantyMonths(warrantyType, body.warrantyMonths ?? null);
  const benefits = parseBenefits(body.benefits ?? []);

  return {
    price: parsePrice(body.price),
    description,
    deliveryInfo: deliveryInfo || null,
    condition,
    warrantyType,
    warrantyMonths,
    benefits,
  };
}
