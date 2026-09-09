"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SearchFilters = {
  q: string | null;
  category: string | null;
  city: string | null;
  district: string | null;
  minBudget: number | null;
  maxBudget: number | null;
  condition: string | null;
  date: string | null;
  sort: string | null;
};

type ParseResponse = {
  filters?: SearchFilters;
  needsClarification?: boolean;
  clarificationQuestion?: string | null;
  error?: string;
};

const conditionLabels: Record<string, string> = {
  NEW: "Sıfır",
  USED: "İkinci El",
  REFURBISHED: "Yenilenmiş",
  UNKNOWN: "Fark Etmez",
};

function toSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.minBudget != null) params.set("minBudget", String(filters.minBudget));
  if (filters.maxBudget != null) params.set("maxBudget", String(filters.maxBudget));
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.date) params.set("date", filters.date);
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}

function previewRows(filters: SearchFilters, categoryNames: Record<string, string>) {
  const location = [filters.city, filters.district].filter(Boolean).join(" / ");
  let budget: string | null = null;
  if (filters.minBudget != null && filters.maxBudget != null) budget = `${filters.minBudget.toLocaleString("tr-TR")} - ${filters.maxBudget.toLocaleString("tr-TR")} TL`;
  else if (filters.maxBudget != null) budget = `${filters.maxBudget.toLocaleString("tr-TR")} TL'ye kadar`;
  else if (filters.minBudget != null) budget = `${filters.minBudget.toLocaleString("tr-TR")} TL'den başlayan`;
  return [
    filters.category ? { label: "Kategori", value: categoryNames[filters.category] ?? filters.category } : null,
    location ? { label: "Konum", value: location } : null,
    budget ? { label: "Bütçe", value: budget } : null,
    filters.condition ? { label: "Durum", value: conditionLabels[filters.condition] ?? filters.condition } : null,
    filters.q ? { label: "Arama", value: filters.q } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
}

export function AiSearchForm({ categoryNames, compact = false }: { categoryNames: Record<string, string>; compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParseResponse | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setParsed(null);
    setLoading(true);
    try {
      const response = await fetch("/api/search/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await response.json()) as ParseResponse;
      if (!response.ok || !data.filters) {
        setError(data.error || "Yapay zekâ ile arama şu anda kullanılamıyor. Klasik filtreleri kullanarak arama yapabilirsiniz.");
        return;
      }
      setParsed(data);
    } catch {
      setError("Yapay zekâ ile arama şu anda kullanılamıyor. Klasik filtreleri kullanarak arama yapabilirsiniz.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!parsed?.filters) return;
    const params = toSearchParams(parsed.filters);
    router.push(params.toString() ? `/talepler?${params}` : "/talepler");
  };

  const rows = parsed?.filters ? previewRows(parsed.filters, categoryNames) : [];

  return (
    <section className={`ai-search-panel ${compact ? "ai-search-compact" : ""}`} id="ai-search" aria-label="Doğal dil araması">
      <form onSubmit={submit}>
        <label>
          <span className="eyebrow">✨ AI ile ne aradığını anlat</span>
          <textarea
            name="ai-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Örn: İzmir Bornova'da 20 bin TL civarında temiz ikinci el PS5 arıyorum"
            maxLength={1500}
            rows={compact ? 2 : 3}
          />
        </label>
        <button className="button-primary" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? <span className="button-loading"><span className="spinner" aria-hidden="true" /> Araman analiz ediliyor...</span> : "AI ile Ara"}
        </button>
      </form>
      {loading ? <p className="ai-thinking" role="status">AI düşünüyor...</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {parsed?.filters ? (
        <div className="ai-search-preview">
          <strong>AI&apos;nin anladıkları</strong>
          {rows.length ? (
            <ul>{rows.map((item) => <li key={item.label}><small>{item.label}</small>{item.value}</li>)}</ul>
          ) : (
            <p>Bu cümleden net bir filtre çıkmadı. Klasik filtreleri kullanabilirsin.</p>
          )}
          {parsed.needsClarification && parsed.clarificationQuestion ? <p className="ai-search-clarify">{parsed.clarificationQuestion}</p> : null}
          <button className="button-primary" type="button" onClick={applyFilters} disabled={!rows.length}>Filtreleri Uygula</button>
        </div>
      ) : null}
    </section>
  );
}
