"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OfferContactButton({ offerId }: { offerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startConversation = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/offers/${offerId}/conversation`, { method: "POST" });
      const result = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !result.id) throw new Error(result.error || "Konuşma başlatılamadı.");
      router.push(`/mesajlar/${result.id}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Konuşma başlatılamadı.");
      setLoading(false);
    }
  };

  return <div className="offer-contact-action"><button className="offer-message-button" type="button" onClick={startConversation} disabled={loading}>{loading ? "Açılıyor..." : "Mesaj Gönder ↗"}</button>{error ? <span role="alert">{error}</span> : null}</div>;
}
