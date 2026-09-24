"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type FilterFormProps = {
  categories: Array<{ name: string; slug: string }>;
  locations: Record<string, string[]>;
  initial: { q?: string; category?: string; city?: string; district?: string; minBudget?: number; maxBudget?: number; condition?: string; date?: string; sort?: string; sameDayNeeded?: boolean };
  conditionLabels: Record<string, string>;
  dateLabels: Record<string, string>;
  sortLabels: Record<string, string>;
  mode?: "quick" | "detailed";
};

type ProductSuggestion = { id: string; name: string };

export function RequestFilterForm({ categories, locations, initial, conditionLabels, dateLabels, sortLabels, mode = "detailed" }: FilterFormProps) {
  const [city, setCity] = useState(initial.city ?? "");
  const [district, setDistrict] = useState(initial.district ?? "");
  const districts = city ? locations[city] ?? [] : [];
  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict("");
  };

  const [query, setQuery] = useState(initial.q ?? "");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchBoxRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    const timeout = setTimeout(async () => {
      if (trimmed.length < 2) {
        setSuggestions([]);
        setSuggestionsOpen(false);
        setLoadingSuggestions(false);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/products/suggest?q=${encodeURIComponent(trimmed)}`);
        const data = await response.json();
        setSuggestions(Array.isArray(data.results) ? data.results : []);
        setSuggestionsOpen(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectSuggestion(name: string) {
    setQuery(name);
    setSuggestionsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        event.preventDefault();
        selectSuggestion(suggestions[activeIndex].name);
      }
    } else if (event.key === "Escape") {
      setSuggestionsOpen(false);
    }
  }

  return <form className="request-filters" method="get">
    <label className="request-filter-search" ref={searchBoxRef} style={{ position: "relative" }}>
      <span>Ne arıyorsun?</span>
      <input
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true); }}
        placeholder="Örn. PS5 Slim"
        autoComplete="off"
      />
      {suggestionsOpen && (loadingSuggestions || suggestions.length > 0) ? (
        <ul className="request-search-suggestions" role="listbox">
          {loadingSuggestions ? <li className="request-search-suggestions-loading">Aranıyor…</li> : suggestions.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : undefined}
                onMouseDown={(event) => { event.preventDefault(); selectSuggestion(item.name); }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </label>
    {mode === "detailed" ? <>
    <label><span>Kategori</span><select name="category" defaultValue={initial.category ?? ""}><option value="">Tüm kategoriler</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
    <label><span>Şehir</span><select name="city" value={city} onChange={(event) => handleCityChange(event.target.value)}><option value="">Tüm şehirler</option>{Object.keys(locations).map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
    <label><span>İlçe</span><select name="district" value={district} onChange={(event) => setDistrict(event.target.value)} disabled={!city}><option value="">Tüm ilçeler</option>{districts.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
    <label><span>Minimum bütçe</span><input name="minBudget" type="number" min="0" step="0.01" defaultValue={initial.minBudget ?? ""} placeholder="0" /></label>
    <label><span>Maksimum bütçe</span><input name="maxBudget" type="number" min="0" step="0.01" defaultValue={initial.maxBudget ?? ""} placeholder="100000" /></label>
    <label><span>Ürün durumu</span><select name="condition" defaultValue={initial.condition ?? ""}><option value="">Tüm durumlar</option>{Object.entries(conditionLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <label><span>Tarih</span><select name="date" defaultValue={initial.date ?? ""}><option value="">Her zaman</option>{Object.entries(dateLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <label className="check-row"><input type="checkbox" name="sameDayNeeded" value="1" defaultChecked={initial.sameDayNeeded ?? false} /><span>Aynı Gün Lazım</span></label>
    <label><span>Sıralama</span><select name="sort" defaultValue={initial.sort ?? "newest"}>{Object.entries(sortLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <div className="request-filter-actions"><button className="button-primary" type="submit">Filtreleri uygula</button><Link className="button-quiet" href="/talepler">Temizle</Link></div>
    </> : <div className="request-filter-actions"><button className="button-primary" type="submit">Ara</button></div>}
  </form>;
}
