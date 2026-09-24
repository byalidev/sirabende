import { locations } from "../../config/locations";
import type { AiParsedIntent } from "./types";

const STOP_WORDS = new Set([
  "arıyorum", "ariyorum", "istiyorum", "lazım", "bir", "biraz", "temiz", "uygun", "fiyatlı", "fiyatli",
  "tl", "bin", "binlik", "altı", "altına", "kadar", "arasında", "arasi", "da", "de", "için",
  "icin", "ve", "ile", "gibi", "tane", "adet", "civarı", "civarinda", "civarında",
]);

const CATEGORY_HINTS: Array<{ slug: string; terms: string[] }> = [
  { slug: "oyun-konsolu", terms: ["ps5", "ps4", "playstation", "xbox", "nintendo", "switch", "konsol"] },
  { slug: "telefon", terms: ["iphone", "samsung", "galaxy", "telefon", "xiaomi", "redmi"] },
  { slug: "bilgisayar", terms: ["laptop", "macbook", "notebook", "bilgisayar", "pc"] },
  { slug: "otomobil", terms: ["otomobil", "araba", "otomotiv", "honda", "civic"] },
  { slug: "motosiklet", terms: ["motosiklet", "motor"] },
  { slug: "ev", terms: ["mobilya", "beyaz eşya", "beyaz esya"] },
];

function normalize(text: string) {
  return text.toLocaleLowerCase("tr-TR").replace(/['’]/g, "");
}

function toTry(raw: string, treatAsThousands: boolean) {
  const value = Number(raw.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(treatAsThousands && value < 1000 ? value * 1000 : value);
}

function parseBudgetTokens(text: string) {
  const lowered = normalize(text);
  const asThousands = lowered.includes("bin");
  const range = lowered.match(/(\d+(?:[.,]\d+)?)\s*(?:bin)?\s*(?:-|–|ile)\s*(\d+(?:[.,]\d+)?)\s*(?:bin)?/);
  if (range) {
    return { minBudget: toTry(range[1], asThousands), maxBudget: toTry(range[2], asThousands) };
  }

  const withUnit = lowered.match(/(\d+(?:[.,]\d+)?)\s*(bin|tl)/);
  if (withUnit) {
    return { minBudget: null, maxBudget: toTry(withUnit[1], withUnit[2] === "bin" || asThousands) };
  }

  const large = lowered.match(/\b(\d{4,})\b/);
  if (!large) return { minBudget: null, maxBudget: null };
  const value = toTry(large[1], false);
  if (value === null) return { minBudget: null, maxBudget: null };
  return { minBudget: null, maxBudget: value };
}

function detectCondition(text: string): AiParsedIntent["condition"] {
  const lowered = normalize(text);
  if (/sıfır|sifir|yeni/.test(lowered) && !/ikinci/.test(lowered)) return "NEW";
  if (/yenilenmi/.test(lowered)) return "REFURBISHED";
  if (/ikinci el|kullanılm|kullanilm/.test(lowered)) return "USED";
  return null;
}

function matchLocationValue(source: string, value: string) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?:da|de|daki|deki)?(?=$|[^\\p{L}\\p{N}])`, "giu");
  return pattern.test(source);
}

function detectLocation(text: string) {
  const lowered = normalize(text);
  let city: string | null = null;
  let district: string | null = null;
  for (const [knownCity, districts] of Object.entries(locations)) {
    if (matchLocationValue(lowered, normalize(knownCity))) city = knownCity;
    for (const item of districts) {
      const normalizedItem = normalize(item);
      if (matchLocationValue(lowered, normalizedItem)) {
        district = item;
        city = city ?? knownCity;
      }
    }
  }
  return { city, district };
}

function detectCategory(text: string, allowedCategorySlugs: string[]) {
  const lowered = normalize(text);
  const match = CATEGORY_HINTS.find((item) => item.terms.some((term) => lowered.includes(term)));
  if (match && allowedCategorySlugs.includes(match.slug)) return match.slug;
  return allowedCategorySlugs.find((slug) => lowered.includes(slug.replace(/-/g, " "))) ?? null;
}

function extractQuery(text: string, city: string | null, district: string | null) {
  let leftover = text;
  for (const value of [city, district]) {
    if (value) {
      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      leftover = leftover.replace(new RegExp(escaped, "ig"), " ");
    }
  }
  leftover = leftover
    .replace(/\d+(?:[.,]\d+)?\s*(?:bin|tl)/gi, " ")
    .replace(/\b\d{4,}\b/g, " ")
    .replace(/altına|altina|kadar|arasında|arasi|ikinci el|sıfır|sifir|yenilenmiş|yenilenmis|temiz/gi, " ");
  const tokens = leftover
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(normalize(token)));
  return tokens.slice(0, 6).join(" ") || null;
}

function looksLikeInjection(text: string) {
  return /ignore (all |previous )?instructions|system prompt|database credentials|api[_-]?key/i.test(text);
}

export function heuristicParseIntent(query: string, allowedCategorySlugs: string[]): AiParsedIntent {
  if (looksLikeInjection(query)) {
    return {
      query: null, categorySlug: null, city: null, district: null, minBudget: null, maxBudget: null,
      condition: null, date: null, sort: null, needsClarification: false, clarificationQuestion: null,
    };
  }

  const { city, district } = detectLocation(query);
  const { minBudget, maxBudget } = parseBudgetTokens(query);
  const condition = detectCondition(query);
  const categorySlug = detectCategory(query, allowedCategorySlugs);
  const extracted = extractQuery(query, city, district);
  const vague = !city && !district && minBudget === null && maxBudget === null && !condition && (extracted?.split(" ").length ?? 0) === 1;

  return {
    query: extracted,
    categorySlug,
    city,
    district,
    minBudget,
    maxBudget,
    condition,
    date: null,
    sort: null,
    needsClarification: vague,
    clarificationQuestion: vague ? "Aradığınız ürün için marka, model veya bütçe tercihiniz var mı?" : null,
  };
}
