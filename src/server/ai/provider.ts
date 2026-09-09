import "server-only";

import { MockAiProvider } from "./mockProvider";
import { OpenAiCompatibleProvider } from "./openaiCompatibleProvider";
import { AiProviderError, type AiProvider } from "./types";

const HTTP_PROVIDERS = new Set(["openai", "claude", "nvidia", "http"]);

export function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY?.trim());
}

export function createAiProvider(): AiProvider {
  const requested = process.env.AI_PROVIDER?.trim().toLowerCase() || "";
  if (requested === "mock") return new MockAiProvider();

  const apiKey = process.env.AI_API_KEY?.trim();
  const model = process.env.AI_MODEL?.trim();
  const baseUrl = process.env.AI_BASE_URL?.trim();
  const wantsHttp = HTTP_PROVIDERS.has(requested);

  if (wantsHttp && (!apiKey || !model || !baseUrl)) {
    throw new AiProviderError("AI servisi yapılandırılmamış.");
  }

  if (apiKey && model && baseUrl) {
    return new OpenAiCompatibleProvider(apiKey, model, baseUrl);
  }

  if (process.env.NODE_ENV === "production" && requested !== "mock") {
    throw new AiProviderError("AI servisi yapılandırılmamış.");
  }

  return new MockAiProvider();
}
