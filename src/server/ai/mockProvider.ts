import { heuristicParseIntent } from "./heuristic";
import type { AiProvider } from "./types";

export class MockAiProvider implements AiProvider {
  readonly name = "mock" as const;

  async parse({ query, allowedCategorySlugs }: { query: string; allowedCategorySlugs: string[] }) {
    return heuristicParseIntent(query, allowedCategorySlugs);
  }
}
