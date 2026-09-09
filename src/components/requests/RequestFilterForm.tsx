"use client";

import { useState } from "react";
import Link from "next/link";

type FilterFormProps = {
  categories: Array<{ name: string; slug: string }>;
  locations: Record<string, string[]>;
  initial: { q?: string; category?: string; city?: string; district?: string; minBudget?: number; maxBudget?: number; condition?: string; date?: string; sort?: string };
  conditionLabels: Record<string, string>;
  dateLabels: Record<string, string>;
  sortLabels: Record<string, string>;
};

export function RequestFilterForm({ categories, locations, initial, conditionLabels, dateLabels, sortLabels }: FilterFormProps) {
  const [city, setCity] = useState(initial.city ?? "");
  const [district, setDistrict] = useState(initial.district ?? "");
  const districts = city ? locations[city] ?? [] : [];
  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict("");
  };
  return <form className="request-filters" method="get">
    <label className="request-filter-search"><span>Ne arıyorsun?</span><input name="q" defaultValue={initial.q ?? ""} placeholder="Örn. PS5 Slim" /></label>
    <label><span>Kategori</span><select name="category" defaultValue={initial.category ?? ""}><option value="">Tüm kategoriler</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
    <label><span>Şehir</span><select name="city" value={city} onChange={(event) => handleCityChange(event.target.value)}><option value="">Tüm şehirler</option>{Object.keys(locations).map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
    <label><span>İlçe</span><select name="district" value={district} onChange={(event) => setDistrict(event.target.value)} disabled={!city}><option value="">Tüm ilçeler</option>{districts.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
    <label><span>Minimum bütçe</span><input name="minBudget" type="number" min="0" step="0.01" defaultValue={initial.minBudget ?? ""} placeholder="0" /></label>
    <label><span>Maksimum bütçe</span><input name="maxBudget" type="number" min="0" step="0.01" defaultValue={initial.maxBudget ?? ""} placeholder="100000" /></label>
    <label><span>Ürün durumu</span><select name="condition" defaultValue={initial.condition ?? ""}><option value="">Tüm durumlar</option>{Object.entries(conditionLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <label><span>Tarih</span><select name="date" defaultValue={initial.date ?? ""}><option value="">Her zaman</option>{Object.entries(dateLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <label><span>Sıralama</span><select name="sort" defaultValue={initial.sort ?? "newest"}>{Object.entries(sortLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    <div className="request-filter-actions"><button className="button-primary" type="submit">Filtreleri uygula</button><Link className="button-quiet" href="/talepler">Temizle</Link></div>
  </form>;
}
