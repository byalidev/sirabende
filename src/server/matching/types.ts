import type { OfferStatus, RequestCondition } from "@prisma/client";

export const MATCH_WEIGHTS = {
  category: 40,
  city: 20,
  district: 15,
  budget: 15,
  condition: 5,
  text: 5,
} as const;

export type MatchProfile = {
  query?: string;
  categorySlug?: string | null;
  city?: string | null;
  district?: string | null;
  minBudget?: number | null;
  maxBudget?: number | null;
  condition?: RequestCondition | null;
};

export type MatchResult = {
  score: number;
  reasons: string[];
};

export type OfferMatchInput = {
  id: string;
  price: string;
  currency: string;
  description: string | null;
  deliveryInfo: string | null;
  status: OfferStatus;
  condition: RequestCondition;
  sellerCity: string | null;
  sellerDistrict: string | null;
  createdAt: string;
};

export type Scored<T> = T & MatchResult;
