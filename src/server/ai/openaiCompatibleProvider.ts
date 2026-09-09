import "server-only";

import { locations } from "../../config/locations";
import { buildSearchParsePrompt } from "./prompts";
import { AiProviderError, AI_TIMEOUT_MS, type AiProvider } from "./types";

function parseJsonObject(text: string) {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) throw new AiProviderError("AI yanıtı okunamadı.");
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
  } catch {
    throw new AiProviderError("AI yanıtı okunamadı.");
  }
}

export class OpenAiCompatibleProvider implements AiProvider {
  readonly name = "http" as const;

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
  ) {}

  async parse({ query, allowedCategorySlugs }: { query: string; allowedCategorySlugs: string[] }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    try {
      const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: buildSearchParsePrompt(allowedCategorySlugs, Object.keys(locations), locations) },
            { role: "user", content: query },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AiProviderError("AI sağlayıcısı yanıt vermedi.");
      }

      const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new AiProviderError("AI sağlayıcısı boş yanıt döndü.");
      try {
        return parseJsonObject(content);
      } catch (error) {
        if (error instanceof AiProviderError) throw error;
        throw new AiProviderError("AI yanıtı okunamadı.");
      }
    } catch (error) {
      if (error instanceof AiProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new AiProviderError("AI araması zaman aşımına uğradı.");
      throw new AiProviderError();
    } finally {
      clearTimeout(timer);
    }
  }
}
