"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const offerBenefits = [
  { value: "BOX_INCLUDED", label: "Kutu dahil" },
  { value: "INVOICE", label: "Fatura var" },
  { value: "FAST_DELIVERY", label: "Hızlı teslim" },
  { value: "SHIPPING_INCLUDED", label: "Kargo dahil" },
  { value: "CERTIFIED", label: "Sertifikalı / kontrol edilmiş" },
  { value: "PAYMENT_PLAN", label: "Taksit imkanı" },
] as const;

function formatPrice(value: string) {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function OfferForm({ requestId, canOffer }: { requestId: string; canOffer: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("USED");
  const [description, setDescription] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("Elden teslim");
  const [warrantyType, setWarrantyType] = useState("NONE");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canOffer) return null;

  const toggleBenefit = (value: string) => {
    setBenefits((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const submitOffer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, condition, description, deliveryInfo, warrantyType, warrantyMonths: warrantyType === "NONE" ? null : warrantyMonths, benefits }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Teklif oluşturulurken bir hata oluştu.");
      setPrice("");
      setCondition("USED");
      setDescription("");
      setDeliveryInfo("Elden teslim");
      setWarrantyType("NONE");
      setWarrantyMonths("");
      setBenefits([]);
      setSuccess("Teklifiniz başarıyla gönderildi.");
      setIsOpen(false);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Teklif oluşturulurken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="offer-form-shell">
      {!isOpen ? <button className="button-primary offer-open-button" type="button" onClick={() => { setSuccess(""); setIsOpen(true); }}>Teklif Ver <span aria-hidden="true">↗</span></button> : null}
      {success ? <p className="offer-success" role="status">{success}</p> : null}
      {isOpen ? (
        <form className="offer-form" onSubmit={submitOffer}>
          <div className="offer-form-heading"><div><span className="eyebrow">Satıcı olarak</span><h3>Teklifini paylaş.</h3></div><button className="offer-close" type="button" onClick={() => setIsOpen(false)} aria-label="Teklif formunu kapat">×</button></div>
          <label className="offer-form-label" htmlFor="offer-price">Teklif fiyatı</label>
          <div className="offer-price-input"><input id="offer-price" name="price" inputMode="numeric" value={price} onChange={(event) => setPrice(formatPrice(event.target.value))} placeholder="19.500" /><span>₺</span></div>

          <label className="offer-form-label" htmlFor="offer-condition">Ürün durumu</label>
          <select id="offer-condition" name="condition" value={condition} onChange={(event) => setCondition(event.target.value)}>
            <option value="NEW">Sıfır</option>
            <option value="USED">İkinci El</option>
            <option value="REFURBISHED">Yenilenmiş</option>
          </select>

          <label className="offer-form-label" htmlFor="offer-description">Açıklama</label>
          <textarea id="offer-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ürün temiz durumdadır, kutusu ve faturası bulunmaktadır." maxLength={2000} />
          <div className="offer-character-count">{description.length}/2.000 karakter</div>

          <label className="offer-form-label" htmlFor="offer-delivery">Teslimat / Kargo</label>
          <select id="offer-delivery" name="deliveryInfo" value={deliveryInfo} onChange={(event) => setDeliveryInfo(event.target.value)}>
            <option value="Elden teslim">Elden teslim</option>
            <option value="Kurye ile teslim (yakında)" disabled>Kurye ile teslim (yakında)</option>
            <option value="Kargo (yakında)" disabled>Kargo (yakında)</option>
            <option value="Diğer">Diğer</option>
          </select>

          <label className="offer-form-label" htmlFor="offer-warranty-type">Garanti</label>
          <select id="offer-warranty-type" name="warrantyType" value={warrantyType} onChange={(event) => setWarrantyType(event.target.value)}>
            <option value="NONE">Garanti yok</option>
            <option value="SELLER">Satıcı garantisi</option>
            <option value="MANUFACTURER">Üretici garantisi</option>
            <option value="STORE">Mağaza garantisi</option>
          </select>
          {warrantyType !== "NONE" ? (
            <>
              <label className="offer-form-label" htmlFor="offer-warranty-months">Garanti süresi (ay)</label>
              <input id="offer-warranty-months" name="warrantyMonths" inputMode="numeric" value={warrantyMonths} onChange={(event) => setWarrantyMonths(event.target.value.replace(/\D/g, ""))} placeholder="12" />
            </>
          ) : null}

          <div className="offer-benefits-group">
            <span className="offer-form-label">Teklif avantajları</span>
            <div className="offer-benefits-grid">
              {offerBenefits.map((benefit) => (
                <label className={`offer-benefit ${benefits.includes(benefit.value) ? "selected" : ""}`} key={benefit.value}>
                  <input type="checkbox" checked={benefits.includes(benefit.value)} onChange={() => toggleBenefit(benefit.value)} />
                  <span>{benefit.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button-primary offer-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Teklif gönderiliyor..." : "Teklifi Gönder ↗"}</button>
        </form>
      ) : null}
    </div>
  );
}
