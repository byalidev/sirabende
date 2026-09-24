import { Prisma, RequestCondition } from "@prisma/client";
import { locations } from "../../config/locations";

export type CreateRequestInput = {
  title: string;
  description: string;
  categorySlug: string;
  minBudget?: string | null;
  maxBudget?: string | null;
  flexibleBudget?: boolean;
  city: string;
  district: string;
  condition: string;
  preferredFeatures?: unknown;
  sameDayNeeded?: boolean;
};

export type ValidatedRequestInput = {
  title: string;
  description: string;
  categorySlug: string;
  minBudget: Prisma.Decimal | null;
  maxBudget: Prisma.Decimal | null;
  city: string;
  district: string;
  condition: RequestCondition;
  preferredFeatures: string[];
  sameDayNeeded: boolean;
  expiresAt: Date;
};

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestValidationError";
  }
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new RequestValidationError(`${field} zorunludur.`);
  }
  return value.trim().replace(/\s+/g, " ");
}

function parseBudget(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" && typeof value !== "number") {
    throw new RequestValidationError(`${field} geçerli bir tutar olmalı.`);
  }

  const input = String(value).trim().replace(/\s/g, "");
  if (!/^\d[\d.]*([,]\d{1,2})?$/.test(input)) {
    throw new RequestValidationError(`${field} geçerli bir tutar olmalı.`);
  }

  const normalized = input.replace(/\./g, "").replace(",", ".");
  const amount = new Prisma.Decimal(normalized);
  if (amount.lessThan(0) || amount.greaterThan(100000000)) {
    throw new RequestValidationError(`${field} 0 ile 100.000.000 TL arasında olmalı.`);
  }
  return amount;
}

export function validateCreateRequest(input: unknown): ValidatedRequestInput {
  if (!input || typeof input !== "object") {
    throw new RequestValidationError("Geçersiz talep verisi.");
  }

  const body = input as Partial<CreateRequestInput>;
  const title = requiredString(body.title, "Başlık");
  const description = requiredString(body.description, "Açıklama");
  const categorySlug = requiredString(body.categorySlug, "Kategori").toLowerCase();
  const city = requiredString(body.city, "İl");
  const district = requiredString(body.district, "İlçe");

  if (title.length < 10 || title.length > 100) {
    throw new RequestValidationError("Başlık 10-100 karakter arasında olmalı.");
  }
  if (description.length < 20 || description.length > 2000) {
    throw new RequestValidationError("Açıklama 20-2.000 karakter arasında olmalı.");
  }
  if (!locations[city]?.includes(district)) {
    throw new RequestValidationError("İlçe, seçilen il ile eşleşmiyor.");
  }
  if (!Object.values(RequestCondition).includes(body.condition as RequestCondition)) {
    throw new RequestValidationError("Geçersiz ürün durumu.");
  }

  const minBudget = parseBudget(body.minBudget, "Minimum bütçe");
  const maxBudget = parseBudget(body.maxBudget, "Maksimum bütçe");
  if (minBudget === null && maxBudget === null && body.flexibleBudget !== true) {
    throw new RequestValidationError("En az bir bütçe değeri girilmeli.");
  }
  if (minBudget && maxBudget && minBudget.greaterThan(maxBudget)) {
    throw new RequestValidationError("Minimum bütçe maksimum bütçeden büyük olamaz.");
  }

  if (body.preferredFeatures != null && !Array.isArray(body.preferredFeatures)) {
    throw new RequestValidationError("Tercih edilen özellikler dizi olmalı.");
  }

  const preferredFeatures = Array.isArray(body.preferredFeatures)
    ? body.preferredFeatures.filter((item): item is string => typeof item === "string").slice(0, 6)
    : [];

  const sameDayNeeded = body.sameDayNeeded === true;

  const expiresAt = new Date(Date.now() + (sameDayNeeded ? 36 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000));
  if (expiresAt <= new Date()) {
    throw new RequestValidationError("Talep geçerlilik tarihi oluşturulamadı.");
  }

  return {
    title,
    description,
    categorySlug,
    minBudget,
    maxBudget,
    city,
    district,
    condition: body.condition as RequestCondition,
    sameDayNeeded,
    expiresAt,
    preferredFeatures,
  } as ValidatedRequestInput & { preferredFeatures: string[] };
}
