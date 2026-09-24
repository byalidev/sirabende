"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestFeature } from "../../server/requests/features";

const features: Array<{ feature: RequestFeature; label: string; until: "featuredUntil" | "pinnedUntil" | "urgentUntil"; durations: number[] }> = [
  { feature: "featured", label: "Öne çıkarma", until: "featuredUntil", durations: [24, 72, 168] },
  { feature: "pinned", label: "Sabitleme", until: "pinnedUntil", durations: [24, 72, 168] },
  { feature: "urgent", label: "Acil", until: "urgentUntil", durations: [24, 72] },
];

export function RequestFeatureForm({ id, values }: { id: string; values: Record<"featuredUntil" | "pinnedUntil" | "urgentUntil", string | null> }) {
  const router = useRouter(); const [pending, setPending] = useState<RequestFeature | null>(null); const [error, setError] = useState(""); const [now, setNow] = useState<number | null>(null);
  useEffect(() => { const timer = window.setTimeout(() => setNow(Date.now()), 0); return () => window.clearTimeout(timer); }, []);
  const update = async (feature: RequestFeature, durationHours: number | null) => { setPending(feature); setError(""); try { const response = await fetch(`/api/admin/requests/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ feature, durationHours }) }); const body = await response.json() as { error?: string }; if (!response.ok) throw new Error(body.error ?? "Özellik güncellenemedi."); router.refresh(); } catch (updateError) { setError(updateError instanceof Error ? updateError.message : "Özellik güncellenemedi."); } finally { setPending(null); } };
  return <div className="admin-request-features">{features.map((item) => { const until = values[item.until]; const active = Boolean(now !== null && until && new Date(until).getTime() > now); return <div key={item.feature}><span>{item.label}: {active ? "Aktif" : "Pasif"}</span><select aria-label={`${item.label} süresi`} defaultValue={item.durations[0]} onChange={(event) => { const durationHours = Number(event.target.value); if (durationHours) update(item.feature, durationHours); }} disabled={pending !== null}><option value="">Süre seç</option>{item.durations.map((hours) => <option value={hours} key={hours}>{hours === 24 ? "24 saat" : `${hours / 24} gün`}</option>)}</select>{active ? <button className="button-quiet" type="button" disabled={pending !== null} onClick={() => update(item.feature, null)}>Kaldır</button> : <button className="button-primary" type="button" disabled={pending !== null} onClick={() => update(item.feature, item.durations[0])}>Etkinleştir</button>}</div>; })}{error ? <small className="admin-form-error">{error}</small> : null}</div>;
}