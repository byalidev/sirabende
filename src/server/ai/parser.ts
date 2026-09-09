import "server-only";

import { createAiProvider } from "./provider";
import { AiProviderError, type AiParseResult } from "./types";
import { assertSearchQuery, intentToRequestFilters, toPublicSearchFilters, validateAiParsedIntent } from "./validation";

export async function parseSearchIntent(rawQuery: unknown, allowedCategorySlugs: string[]): Promise<AiParseResult> {
  const query = assertSearchQuery(rawQuery);
  const provider = createAiProvider();
  let raw: unknown;
  try {
    raw = await provider.parse({ query, allowedCategorySlugs });
  } catch (error) {
    if (error instanceof AiProviderError) throw error;
    throw new AiProviderError();
  }

  const intent = validateAiParsedIntent(raw, allowedCategorySlugs);
  const filters = intentToRequestFilters(intent);
  return {
    filters,
    publicFilters: toPublicSearchFilters(filters),
    needsClarification: intent.needsClarification,
    clarificationQuestion: intent.clarificationQuestion,
  };
}
