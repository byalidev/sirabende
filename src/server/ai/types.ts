import type { RequestCondition } from "@prisma/client";
import type { RequestDateFilter, RequestFilters, RequestSort } from "../requests/repository";

export const AI_QUERY_MAX_LENGTH = 1500;
export const AI_QUERY_MIN_LENGTH = 3;
export const AI_TIMEOUT_MS = 12_000;

export type AiParsedIntent = {
  query: string | null;
  categorySlug: string | null;
  city: string | null;
  district: string | null;
  minBudget: number | null;
  maxBudget: number | null;
  condition: RequestCondition | null;
  date: RequestDateFilter | null;
  sort: RequestSort | null;
  needsClarification: boolean;
  clarificationQuestion: string | null;
};

export type PublicSearchFilters = {
  q: string | null;
  category: string | null;
  city: string | null;
  district: string | null;
  minBudget: number | null;
  maxBudget: number | null;
  condition: RequestCondition | null;
  date: RequestDateFilter | null;
  sort: RequestSort;
};

export type AiParseResult = {
  filters: RequestFilters;
  publicFilters: PublicSearchFilters;
  needsClarification: boolean;
  clarificationQuestion: string | null;
};

export type AiProviderName = "mock" | "http" | "openai" | "claude" | "nvidia";

export interface AiProvider {
  readonly name: AiProviderName;
  parse(input: { query: string; allowedCategorySlugs: string[] }): Promise<unknown>;
}

export class AiValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiValidationError";
  }
}

export class AiProviderError extends Error {
  constructor(message = "AI sağlayıcısı şu anda kullanılamıyor.") {
    super(message);
    this.name = "AiProviderError";
  }
}
