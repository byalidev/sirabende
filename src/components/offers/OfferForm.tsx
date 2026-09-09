"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

function formatPrice(value: string) {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function OfferForm({ requestId, canOffer }: { requestId: string; canOffer: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("Elden teslim");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canOffer) return null;

  const submitOffer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/requests/${requestId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, description, deliveryInfo }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Teklif oluşturulurken bir hata oluştu.");
      setPrice("");
      setDescription("");
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
          <label className="offer-form-label" htmlFor="offer-description">Açıklama</label>
          <textarea id="offer-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ürün temiz durumdadır, kutusu ve faturası bulunmaktadır." maxLength={2000} />
          <div className="offer-character-count">{description.length}/2.000 karakter</div>
          <label className="offer-form-label" htmlFor="offer-delivery">Teslimat / Kargo</label>
          <select id="offer-delivery" name="deliveryInfo" value={deliveryInfo} onChange={(event) => setDeliveryInfo(event.target.value)}><option>Elden teslim</option><option>Kargo</option><option>Diğer</option></select>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button-primary offer-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Teklif gönderiliyor..." : "Teklifi Gönder ↗"}</button>
        </form>
      ) : null}
    </div>
  );
}
