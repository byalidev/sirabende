import type { RequestCondition } from "@prisma/client";
import type { OfferView } from "../offers/repository";
import type { RequestFilters, RequestView } from "../requests/repository";
import { MATCH_WEIGHTS, type MatchProfile, type MatchResult, type OfferMatchInput, type Scored } from "./types";

export type { MatchProfile, MatchResult, OfferMatchInput, Scored };
export { MATCH_WEIGHTS };

const INACTIVE_OFFER_STATUSES = new Set(["REJECTED", "WITHDRAWN", "EXPIRED"]);

export function filtersToMatchProfile(filters: RequestFilters): MatchProfile {
  return {
    query: filters.q,
    categorySlug: filters.category,
    city: filters.city,
    district: filters.district,
    minBudget: filters.minBudget,
    maxBudget: filters.maxBudget,
    condition: filters.condition,
  };
}

export function requestToMatchProfile(request: RequestView): MatchProfile {
  return {
    query: [request.title, request.description].filter(Boolean).join(" "),
    categorySlug: request.category?.slug,
    city: request.city,
    district: request.district,
    minBudget: request.minBudget ? Number(request.minBudget) : null,
    maxBudget: request.maxBudget ? Number(request.maxBudget) : null,
    condition: request.condition,
  };
}

function tokens(value: string | null | undefined) {
  if (!value) return [];
  return value
    .toLocaleLowerCase("tr-TR")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 1);
}

function scoreText(profileQuery: string | undefined, title: string, description: string | null, extra: string[] = []) {
  const profileTokens = tokens(profileQuery);
  if (!profileTokens.length) return { points: 0, matched: false };
  const haystack = new Set(tokens([title, description, ...extra].join(" ")));
  const hits = profileTokens.filter((token) => haystack.has(token)).length;
  if (!hits) return { points: 0, matched: false };
  return { points: Math.round((hits / profileTokens.length) * MATCH_WEIGHTS.text), matched: true };
}

function scoreBudget(profileMin?: number | null, profileMax?: number | null, candidateMin?: number | null, candidateMax?: number | null) {
  if (profileMin == null && profileMax == null) return 0;
  const candidateLow = candidateMin ?? candidateMax;
  const candidateHigh = candidateMax ?? candidateMin;
  if (candidateLow == null && candidateHigh == null) return 0;
  const profileLow = profileMin ?? 0;
  const profileHigh = profileMax ?? Number.POSITIVE_INFINITY;
  const overlaps = (candidateLow ?? 0) <= profileHigh && (candidateHigh ?? Number.POSITIVE_INFINITY) >= profileLow;
  return overlaps ? MATCH_WEIGHTS.budget : 0;
}

function conditionCompatible(profile: RequestCondition | null | undefined, candidate: RequestCondition | null | undefined) {
  if (!profile || !candidate) return false;
  return profile === candidate || profile === "UNKNOWN" || candidate === "UNKNOWN";
}

export function scoreRequestMatchResult(profile: MatchProfile, candidate: RequestView, productTerms: string[] = []): MatchResult {
  const reasons: string[] = [];
  const category = profile.categorySlug && candidate.category?.slug === profile.categorySlug ? MATCH_WEIGHTS.category : 0;
  if (category) reasons.push("Kategori eşleşiyor");
  const city = profile.city && candidate.city === profile.city ? MATCH_WEIGHTS.city : 0;
  if (city) reasons.push("İl eşleşiyor");
  const district = profile.district && candidate.district === profile.district ? MATCH_WEIGHTS.district : 0;
  if (district) reasons.push("İlçe eşleşiyor");
  const budget = scoreBudget(
    profile.minBudget,
    profile.maxBudget,
    candidate.minBudget ? Number(candidate.minBudget) : null,
    candidate.maxBudget ? Number(candidate.maxBudget) : null,
  );
  if (budget) reasons.push("Bütçe aralığı uyumlu");
  const condition = conditionCompatible(profile.condition, candidate.condition) ? MATCH_WEIGHTS.condition : 0;
  if (condition) reasons.push("Ürün durumu eşleşiyor");
  const text = scoreText(profile.query, candidate.title, candidate.description, productTerms);
  if (text.matched) reasons.push("Ürün/metin benzerliği");
  return { score: category + city + district + budget + condition + text.points, reasons };
}

export function scoreRequestMatch(profile: MatchProfile, candidate: RequestView, productTerms: string[] = []) {
  return scoreRequestMatchResult(profile, candidate, productTerms).score;
}

export function scoreOfferMatchResult(profile: MatchProfile, offer: OfferMatchInput, productTerms: string[] = []): MatchResult {
  if (INACTIVE_OFFER_STATUSES.has(offer.status)) return { score: 0, reasons: [] };
  const reasons: string[] = [];
  const category = profile.categorySlug ? MATCH_WEIGHTS.category : 0;
  if (category) reasons.push("Kategori eşleşiyor");
  const city = profile.city && offer.sellerCity === profile.city ? MATCH_WEIGHTS.city : 0;
  if (city) reasons.push("İl eşleşiyor");
  const district = profile.district && offer.sellerDistrict === profile.district ? MATCH_WEIGHTS.district : 0;
  if (district) reasons.push("İlçe eşleşiyor");
  const price = Number(offer.price);
  const budget = Number.isFinite(price) ? scoreBudget(profile.minBudget, profile.maxBudget, price, price) : 0;
  if (budget) reasons.push("Teklif bütçenize uygun");
  const condition = conditionCompatible(profile.condition, offer.condition) ? MATCH_WEIGHTS.condition : 0;
  if (condition) reasons.push("Ürün durumu eşleşiyor");
  const text = scoreText(profile.query, offer.description ?? "", offer.deliveryInfo, productTerms);
  if (text.matched) reasons.push("Ürün/metin benzerliği");
  return { score: category + city + district + budget + condition + text.points, reasons };
}

export function scoreOfferMatch(profile: MatchProfile, offer: OfferView, productTerms: string[] = []) {
  return scoreOfferMatchResult(profile, {
    id: offer.id,
    price: offer.price,
    currency: offer.currency,
    description: offer.description,
    deliveryInfo: offer.deliveryInfo,
    status: offer.status,
    condition: "UNKNOWN",
    sellerCity: null,
    sellerDistrict: null,
    createdAt: offer.createdAt,
  }, productTerms).score;
}

export function rankRequests(profile: MatchProfile, requests: RequestView[], productTerms: string[] = []) {
  return [...requests]
    .map((request) => ({ ...request, ...scoreRequestMatchResult(profile, request, productTerms) }))
    .sort((left, right) => right.score - left.score || left.createdAt.localeCompare(right.createdAt) * -1);
}

export function rankOffers(profile: MatchProfile, offers: OfferMatchInput[], productTerms: string[] = []) {
  return [...offers]
    .map((offer) => ({ ...offer, ...scoreOfferMatchResult(profile, offer, productTerms) }))
    .sort((left, right) => right.score - left.score || left.createdAt.localeCompare(right.createdAt) * -1);
}

export function hasMatchIntent(profile: MatchProfile) {
  return Boolean(profile.query || profile.categorySlug || profile.city || profile.district || profile.minBudget != null || profile.maxBudget != null || profile.condition);
}
