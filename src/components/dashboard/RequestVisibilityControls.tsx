"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock3, Flame, Info, Pin, Siren, Sparkles, X } from "lucide-react";
import type { RequestFeature } from "../../server/requests/features";
import type { RequestView } from "../../server/requests/repository";

const featureOptions: Array<{ feature: RequestFeature; title: string; activeTitle: string; description: string; until: keyof Pick<RequestView, "featuredUntil" | "pinnedUntil" | "urgentUntil">; durations: number[]; Icon: typeof Sparkles }> = [
  { feature: "featured", title: "Öne çıkar", activeTitle: "Öne çıkarıldı", description: "Talebini listelerde daha görünür hale getirir.", until: "featuredUntil", durations: [24, 72, 168], Icon: Sparkles },
  { feature: "pinned", title: "Sabitle", activeTitle: "Sabitlendi", description: "Talebini liste sonuçlarının üst sıralarında tutar.", until: "pinnedUntil", durations: [24, 72, 168], Icon: Pin },
  { feature: "urgent", title: "Acil talep", activeTitle: "Acil", description: "Satıcılara ihtiyacının acil olduğunu görünür şekilde bildirir.", until: "urgentUntil", durations: [24, 72, 168], Icon: Siren },
];

function remainingLabel(until: string) {
  const hours = Math.max(0, Math.ceil((new Date(until).getTime() - Date.now()) / (60 * 60 * 1000)));
  return hours >= 24 ? `${Math.floor(hours / 24)} gün ${hours % 24} saat` : `${hours} saat`;
}

function durationLabel(hours: number) {
  return hours === 24 ? "24 saat" : `${hours / 24} gün`;
}

export function RequestVisibilityControls({ request }: { request: RequestView }) {
  const router = useRouter();
  const [durations, setDurations] = useState<Record<RequestFeature, number>>({ featured: 24, pinned: 24, urgent: 24 });
  const [pending, setPending] = useState<RequestFeature | null>(null);
  const [error, setError] = useState("");
  const [quotaReached, setQuotaReached] = useState(false);
  const [removal, setRemoval] = useState<RequestFeature | null>(null);

  const update = async (feature: RequestFeature, durationHours: number | null) => {
    setError("");
    setQuotaReached(false);
    setPending(feature);
    try {
      const response = await fetch(`/api/requests/${request.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ feature, durationHours }) });
      const body = await response.json() as { error?: string; quotaReached?: boolean };
      if (!response.ok) {
        setQuotaReached(Boolean(body.quotaReached) || response.status === 429);
        throw new Error(body.error ?? "Talep görünürlüğü güncellenemedi.");
      }
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Talep görünürlüğü güncellenemedi.");
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="request-visibility-controls">
      <header className="request-visibility-heading"><div><span className="eyebrow">Talep görünürlüğü</span><p>Talebini daha doğru kişilerin karşısına çıkar.</p></div><Flame aria-hidden="true" size={22} strokeWidth={1.8} /></header>
      {quotaReached ? <div className="visibility-quota-alert" role="alert"><AlertTriangle aria-hidden="true" size={20} /><div><strong>Haftalık kullanım limitine ulaştın</strong><p>Bu hafta için 2 görünürlük hakkının tamamını kullandın. Yeni hakların 7 günlük sürenin sonunda yenilenecek.</p></div><button type="button" aria-label="Uyarıyı kapat" onClick={() => setQuotaReached(false)}><X aria-hidden="true" size={17} /></button></div> : null}
      <div className="request-visibility-options">
        {featureOptions.map((option) => {
          const until = request[option.until];
          const active = Boolean(until && new Date(until) > new Date());
          const Icon = option.Icon;
          return <article className={`request-visibility-option ${option.feature}${active ? " is-active" : ""}`} key={option.feature}>
            <div className="request-visibility-option-heading"><span className="request-visibility-icon"><Icon aria-hidden="true" size={19} strokeWidth={2} /></span><div><div className="request-visibility-title"><strong>{active ? option.activeTitle : option.title}</strong><span className="request-visibility-info"><button type="button" aria-label={`${option.title} hakkında bilgi`}><Info aria-hidden="true" size={15} /></button><span role="tooltip">{option.description}</span></span></div><small>{active && until ? <><Clock3 aria-hidden="true" size={13} /> Kalan süre: {remainingLabel(until)}</> : option.description}</small></div></div>
            {active ? <button className="button-quiet request-visibility-submit" type="button" disabled={pending !== null} onClick={() => setRemoval(option.feature)}>{pending === option.feature ? "Kaydediliyor..." : "Kaldır"}</button> : <div className="request-visibility-picker"><div className="request-duration-buttons" aria-label={`${option.title} süresi`}>{option.durations.map((hours) => <button className={durations[option.feature] === hours ? "selected" : ""} type="button" key={hours} onClick={() => setDurations((current) => ({ ...current, [option.feature]: hours }))} disabled={pending !== null || hours !== 24} aria-label={hours === 24 ? "24 saat" : `${durationLabel(hours)} yakında`}>{durationLabel(hours)}<small>{hours === 24 ? "Fiyatlandırma yakında" : "Yakında"}</small></button>)}</div><button className="button-primary request-visibility-submit" type="button" disabled={pending !== null} onClick={() => update(option.feature, durations[option.feature])}>{pending === option.feature ? "Kaydediliyor..." : "Etkinleştir"}</button></div>}
          </article>;
        })}
      </div>
      {error && !quotaReached ? <small className="admin-form-error" role="alert">{error}</small> : null}
      {removal ? <div className="visibility-confirm-backdrop" role="presentation"><div className="visibility-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="visibility-confirm-title"><button className="visibility-confirm-close" type="button" aria-label="Pencereyi kapat" onClick={() => setRemoval(null)}><X aria-hidden="true" size={18} /></button><span className="visibility-confirm-icon"><AlertTriangle aria-hidden="true" size={22} /></span><h2 id="visibility-confirm-title">Görünürlüğü kaldırmak istiyor musun?</h2><p>Bu işlem görünürlüğü hemen kaldırır ve geri alınamaz. Kullandığın hak da iade edilmez.</p><div className="visibility-confirm-actions"><button className="button-quiet" type="button" onClick={() => setRemoval(null)}>Vazgeç</button><button className="button-primary visibility-confirm-danger" type="button" disabled={pending !== null} onClick={() => { setRemoval(null); update(removal, null); }}>Evet, kaldır</button></div></div></div> : null}
    </section>
  );
}
