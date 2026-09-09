"use client";

import { useState } from "react";

export function ReviewForm({ offerId }: { offerId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/offers/${offerId}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, comment }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Değerlendirme gönderilemedi.");
      setMessage("Değerlendirmeniz alındı.");
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Değerlendirme gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="trust-action"><button className="trust-text-button" type="button" onClick={() => setOpen((value) => !value)}>Değerlendir</button>{open ? <div className="review-inline-form"><div className="review-stars" aria-label={`${rating} yıldız`}><span>Değerlendirmeniz</span>{[1, 2, 3, 4, 5].map((value) => <button type="button" className={value <= rating ? "selected" : ""} aria-label={`${value} yıldız`} key={value} onClick={() => setRating(value)}>★</button>)}</div><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Kısa bir yorum ekleyin" maxLength={1000} /><button className="button-primary" type="button" onClick={submit} disabled={loading}>{loading ? "Gönderiliyor..." : "Değerlendirmeyi gönder"}</button></div> : null}{message ? <span className="trust-feedback" role="status">{message}</span> : null}</div>;
}
