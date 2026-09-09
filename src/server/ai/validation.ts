import { RequestCondition } from "@prisma/client";
import { locations } from "../../config/locations";
import type { RequestDateFilter, RequestFilters, RequestSort } from "../requests/repository";
import { AiValidationError, AI_QUERY_MAX_LENGTH, AI_QUERY_MIN_LENGTH, type AiParsedIntent, type PublicSearchFilters } from "./types";

const CONDITIONS = new Set<string>(Object.values(RequestCondition));
const DATES = new Set<string>(["today", "3d", "7d", "30d"]);
const SORTS = new Set<string>(["newest", "oldest", "budget_asc", "budget_desc", "expiring"]);

function asTrimmedString(value: unknown, max: number) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return null;
  return text.slice(0, max);
}

function asBudget(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const amount = typeof value === "number" ? value : typeof value === "string" && /^-?\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : NaN;
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) return null;
  return Math.round(amount);
}

function findCity(value: string | null) {
  if (!value) return null;
  return Object.keys(locations).find((city) => city.localeCompare(value, "tr", { sensitivity: "accent" }) === 0) ?? null;
}

function findDistrict(city: string | null, value: string | null) {
  if (!value) return null;
  if (city) {
    return locations[city]?.find((district) => district.localeCompare(value, "tr", { sensitivity: "accent" }) === 0) ?? null;
  }
  for (const [knownCity, districts] of Object.entries(locations)) {
    const district = districts.find((item) => item.localeCompare(value, "tr", { sensitivity: "accent" }) === 0);
    if (district) return { city: knownCity, district };
  }
  return null;
}

export function assertSearchQuery(input: unknown) {
  if (typeof input !== "string") throw new AiValidationError("Arama metni zorunludur.");
  const query = input.trim().replace(/\s+/g, " ");
  if (query.length < AI_QUERY_MIN_LENGTH) throw new AiValidationError("Arama metni çok kısa.");
  if (query.length > AI_QUERY_MAX_LENGTH) throw new AiValidationError("Arama metni çok uzun.");
  return query;
}

export function validateAiParsedIntent(raw: unknown, allowedCategorySlugs: string[]): AiParsedIntent {
  if (!raw || typeof raw !== "object") throw new AiValidationError("AI çıktısı geçersiz.");
  const body = raw as Record<string, unknown>;
  const query = asTrimmedString(body.query, 120);
  const categorySlugRaw = asTrimmedString(body.categorySlug, 80)?.toLowerCase() ?? null;
  const categorySlug = categorySlugRaw && allowedCategorySlugs.includes(categorySlugRaw) ? categorySlugRaw : null;
  let city = findCity(asTrimmedString(body.city, 40));
  const districtLookup = findDistrict(city, asTrimmedString(body.district, 40));
  let district: string | null = null;
  if (districtLookup && typeof districtLookup === "object") {
    city = city ?? districtLookup.city;
    district = districtLookup.district;
  } else if (typeof districtLookup === "string") {
    district = districtLookup;
  }
  if (district && city && !locations[city]?.includes(district)) district = null;

  let minBudget = asBudget(body.minBudget);
  let maxBudget = asBudget(body.maxBudget);
  if (minBudget !== null && maxBudget !== null && minBudget > maxBudget) {
    const swapped = minBudget;
    minBudget = maxBudget;
    maxBudget = swapped;
  }

  const conditionValue = asTrimmedString(body.condition, 20);
  const condition = conditionValue && CONDITIONS.has(conditionValue) ? conditionValue as RequestCondition : null;
  const dateValue = asTrimmedString(body.date, 10);
  const date = dateValue && DATES.has(dateValue) ? dateValue as RequestDateFilter : null;
  const sortValue = asTrimmedString(body.sort, 20);
  const sort = sortValue && SORTS.has(sortValue) ? sortValue as RequestSort : null;
  const needsClarification = body.needsClarification === true;
  const clarificationQuestion = asTrimmedString(body.clarificationQuestion, 180);

  return {
    query,
    categorySlug,
    city,
    district,
    minBudget,
    maxBudget,
    condition,
    date,
    sort,
    needsClarification,
    clarificationQuestion: needsClarification ? clarificationQuestion : null,
  };
}

export function intentToRequestFilters(intent: AiParsedIntent): RequestFilters {
  return {
    q: intent.query ?? undefined,
    category: intent.categorySlug ?? undefined,
    city: intent.city ?? undefined,
    district: intent.district ?? undefined,
    minBudget: intent.minBudget ?? undefined,
    maxBudget: intent.maxBudget ?? undefined,
    condition: intent.condition ?? undefined,
    date: intent.date ?? undefined,
    sort: intent.sort ?? "newest",
  };
}

export function toPublicSearchFilters(filters: RequestFilters): PublicSearchFilters {
  return {
    q: filters.q ?? null,
    category: filters.category ?? null,
    city: filters.city ?? null,
    district: filters.district ?? null,
    minBudget: filters.minBudget ?? null,
    maxBudget: filters.maxBudget ?? null,
    condition: filters.condition ?? null,
    date: filters.date ?? null,
    sort: filters.sort ?? "newest",
  };
}

export function filtersToSearchParams(filters: RequestFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.minBudget !== undefined) params.set("minBudget", String(filters.minBudget));
  if (filters.maxBudget !== undefined) params.set("maxBudget", String(filters.maxBudget));
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.date) params.set("date", filters.date);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}
