"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { locations } from "../../config/locations";
import {
  initialRequestData,
  requestCategories,
  requestConditions,
  requestExamples,
  steps,
  type RequestFormData,
  type RequestImage,
} from "./requestData";
import { RequestPreview } from "./RequestPreview";
import { showToast } from "../ui/toast";

const draftKey = "sirabende-request-draft";
const maxDescriptionLength = 2000;

function formatBudget(value: string) {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function validateStep(step: number, data: RequestFormData) {
  if (step === 0 && data.searchText.trim().length < 3) return "Ne aradığını birkaç kelimeyle anlat.";
  if (step === 1 && !data.category) return "Devam etmek için bir kategori seç.";
  if (step === 2) {
    const min = Number(data.minBudget.replace(/\./g, ""));
    const max = Number(data.maxBudget.replace(/\./g, ""));
    if (!data.flexibleBudget && !data.minBudget && !data.maxBudget) return "En azından bir bütçe bilgisi gir veya esnek olduğunu belirt.";
    if (min > 100000000 || max > 100000000) return "Bütçe 100.000.000 TL'den büyük olamaz.";
    if (data.minBudget && data.maxBudget && min > max) return "Minimum bütçe maksimum bütçeden büyük olamaz.";
  }
  if (step === 3 && (!data.city || !data.district)) return "İl ve ilçe seçerek devam et.";
  if (step === 4 && !data.condition) return "Ürün durumlarından birini seç.";
  if (step === 5) {
    if (data.title.trim().length < 10 || data.title.trim().length > 100) return "Başlık 10-100 karakter arasında olmalı.";
    if (data.description.trim().length < 20 || data.description.trim().length > maxDescriptionLength) return "Açıklama 20-2.000 karakter arasında olmalı.";
  }
  return "";
}

export function RequestWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RequestFormData>(initialRequestData);
  const [error, setError] = useState("");
  const [draftNotice, setDraftNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftKey);
    if (!savedDraft) return;
    try {
      const parsedDraft = JSON.parse(savedDraft) as Partial<RequestFormData>;
      // localStorage is only available after hydration, so restore the draft here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData({ ...initialRequestData, ...parsedDraft, images: [] });
      setDraftNotice("Kaydedilmiş taslağın geri yüklendi.");
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, []);

  useEffect(() => {
    const draft = { ...data, images: [] };
    window.localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [data]);

  const updateData = <Key extends keyof RequestFormData>(key: Key, value: RequestFormData[Key]) => {
    setData((current) => ({ ...current, [key]: value }));
    setError("");
    setDraftNotice("");
  };

  const goNext = () => {
    const validationError = validateStep(step, data);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const clearDraft = () => {
    window.localStorage.removeItem(draftKey);
    setData(initialRequestData);
    setStep(0);
    setError("");
    setDraftNotice("Taslak temizlendi.");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const availableSlots = 5 - data.images.length;
    const validFiles = files.slice(0, availableSlots).filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024);
    const nextImages: RequestImage[] = validFiles.map((file) => ({ id: `${file.name}-${file.lastModified}`, name: file.name, url: URL.createObjectURL(file) }));
    setData((current) => ({ ...current, images: [...current.images, ...nextImages] }));
    setError(validFiles.length < files.length ? "En fazla 5 fotoğraf ve fotoğraf başına 5 MB ekleyebilirsin." : "");
    event.target.value = "";
  };

  const removeImage = (image: RequestImage) => {
    URL.revokeObjectURL(image.url);
    setData((current) => ({ ...current, images: current.images.filter((item) => item.id !== image.id) }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const publishRequest = async () => {
    const validationError = validateStep(5, data);
    if (validationError) {
      setStep(5);
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          categorySlug: data.category,
          minBudget: data.minBudget,
          maxBudget: data.maxBudget,
          city: data.city,
          district: data.district,
          condition: data.condition,
        }),
      });
      const result = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Talep oluşturulurken bir hata oluştu.");
      window.localStorage.removeItem(draftKey);
      router.push(`/talepler/${result.id}`);
    } catch {
      setError("Talep oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-wizard">
      <div className="request-progress" aria-label="Talep oluşturma ilerlemesi">
        {steps.map((item, index) => (
          <button className={`progress-step ${index === step ? "active" : ""} ${index < step ? "done" : ""}`} type="button" key={item.label} onClick={() => index <= step && setStep(index)} aria-current={index === step ? "step" : undefined}>
            <span>{index + 1}</span>
            <small>{item.shortLabel}</small>
          </button>
        ))}
      </div>

      <div className="request-wizard-layout">
        <div className="request-form-panel">
          {draftNotice ? <div className="draft-notice" role="status">{draftNotice}</div> : null}
          <div className="request-step-heading">
            <span className="eyebrow">Adım {String(step + 1).padStart(2, "0")}</span>
            <h2>{steps[step].label}</h2>
            <p>{step === 0 ? "İhtiyacını kendi kelimelerinle anlat." : "Talebini sana uygun hale getirelim."}</p>
          </div>

          {step === 0 ? (
            <div className="form-step-content">
              <label className="form-label" htmlFor="search-text">Ne arıyorsun?</label>
              <textarea id="search-text" name="searchText" className="form-textarea form-textarea-large" value={data.searchText} onChange={(event) => updateData("searchText", event.target.value)} placeholder="Örn. Temiz bir PS5 Slim arıyorum" autoFocus />
              <div className="example-list"><span>Örnek seç:</span>{requestExamples.map((example) => <button type="button" key={example} onClick={() => updateData("searchText", example)}>{example}</button>)}</div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="form-step-content">
              <fieldset className="form-fieldset"><legend className="form-label">Bir kategori seç</legend><div className="selection-grid category-selection">{requestCategories.map((category) => <button className={`selection-card ${data.category === category.slug ? "selected" : ""}`} type="button" key={category.slug} onClick={() => updateData("category", category.slug)}><span className="selection-icon">{category.icon}</span><strong>{category.name}</strong><small>{category.description}</small></button>)}</div></fieldset>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="form-step-content">
              <fieldset className="form-fieldset"><legend className="form-label">Bütçe aralığın nedir?</legend><div className="budget-grid"><label><span>Minimum bütçe</span><div className="input-with-suffix"><input id="min-budget" name="minBudget" inputMode="numeric" value={data.minBudget} onChange={(event) => updateData("minBudget", formatBudget(event.target.value))} placeholder="15.000" maxLength={11} /><b>₺</b></div></label><label><span>Maksimum bütçe</span><div className="input-with-suffix"><input id="max-budget" name="maxBudget" inputMode="numeric" value={data.maxBudget} onChange={(event) => updateData("maxBudget", formatBudget(event.target.value))} placeholder="20.000" maxLength={11} /><b>₺</b></div></label></div><label className="check-row"><input type="checkbox" checked={data.flexibleBudget} onChange={(event) => updateData("flexibleBudget", event.target.checked)} /><span>Fiyat konusunda esneğim</span></label></fieldset>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="form-step-content"><fieldset className="form-fieldset"><legend className="form-label">Nerede arıyorsun?</legend><div className="budget-grid"><label><span>İl</span><select id="city" name="city" value={data.city} onChange={(event) => { updateData("city", event.target.value); updateData("district", ""); }}><option value="">İl seç</option>{Object.keys(locations).map((city) => <option value={city} key={city}>{city}</option>)}</select></label><label><span>İlçe</span><select id="district" name="district" value={data.district} disabled={!data.city} onChange={(event) => updateData("district", event.target.value)}><option value="">İlçe seç</option>{(locations[data.city] ?? []).map((district) => <option value={district} key={district}>{district}</option>)}</select></label></div><p className="field-hint">İlçe seçimi, il seçtikten sonra aktif olur.</p></fieldset></div>
          ) : null}

          {step === 4 ? (
            <div className="form-step-content"><fieldset className="form-fieldset"><legend className="form-label">Ürün durumu nasıl olsun?</legend><div className="condition-list">{requestConditions.map((condition) => <button className={`condition-card ${data.condition === condition.value ? "selected" : ""}`} type="button" key={condition.value} onClick={() => updateData("condition", condition.value)}><span className="condition-radio" /><span><strong>{condition.label}</strong><small>{condition.description}</small></span></button>)}</div></fieldset></div>
          ) : null}

          {step === 5 ? (
            <div className="form-step-content"><label className="form-label" htmlFor="title">Talebine bir başlık ver</label><input id="title" name="title" className="form-input" value={data.title} onChange={(event) => updateData("title", event.target.value)} placeholder="İzmir'de temiz PS5 Slim arıyorum" maxLength={100} /><div className="character-count">{data.title.length}/100 karakter</div><label className="form-label form-label-spaced" htmlFor="description">Biraz daha detay ver</label><textarea id="description" name="description" className="form-textarea" value={data.description} onChange={(event) => updateData("description", event.target.value)} placeholder="Kutusu, faturası ve kozmetik durumu hakkında beklentilerini anlat..." maxLength={maxDescriptionLength} /><div className="character-count">{data.description.length}/{maxDescriptionLength} karakter</div></div>
          ) : null}

          {step === 6 ? (
            <div className="form-step-content"><div className="upload-zone" onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }} role="button" tabIndex={0}><span className="upload-icon">＋</span><strong>Fotoğraf ekle</strong><small>JPG, PNG veya WEBP · En fazla 5 MB</small><input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} /></div><p className="field-hint">Fotoğraflar sadece bu önizlemede kullanılır, server&apos;a yüklenmez.</p>{data.images.length > 0 ? <div className="image-list">{data.images.map((image) => <div className="image-preview" key={image.id}><img src={image.url} alt={`${image.name} önizlemesi`} /><button type="button" onClick={() => removeImage(image)} aria-label={`${image.name} fotoğrafını sil`}>×</button></div>)}</div> : null}</div>
          ) : null}

          {step === 7 ? <div className="form-step-content"><RequestPreview data={data} /><p className="demo-disclaimer">Talebin database&apos;e kaydedilecek. Fotoğraflar bu fazda yüklenmez.</p></div> : null}

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <div className="wizard-actions"><button className="button-quiet" type="button" onClick={goBack} disabled={step === 0 || isSubmitting}>← Geri</button>{step < steps.length - 1 ? <button className="button-primary" type="button" onClick={goNext} disabled={isSubmitting}>Devam <span aria-hidden="true">→</span></button> : <button className="button-primary" type="button" onClick={publishRequest} disabled={isSubmitting}>{isSubmitting ? "Talep oluşturuluyor..." : "Talebi Yayınla"} {!isSubmitting ? <span aria-hidden="true">↗</span> : null}</button>}</div>
          <button className="clear-draft" type="button" onClick={clearDraft}>Taslağı temizle</button>
        </div>
        <aside className="request-side-preview"><span className="eyebrow">Canlı önizleme</span><h3>Talebin böyle görünecek.</h3><RequestPreview data={data} compact /><p>Bilgilerin adım adım korunur. Son kararı vermeden önce her şeyi kontrol edebilirsin.</p></aside>
      </div>
    </div>
  );
}