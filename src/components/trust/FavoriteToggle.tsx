"use client";

import { useState } from "react";
import { showToast } from "../ui/toast";

export function FavoriteToggle({ requestId, initialFavorited = false }: { requestId: string; initialFavorited?: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/requests/${requestId}/favorite`, { method: favorited ? "DELETE" : "POST" });
      const result = (await response.json()) as { favorited?: boolean; error?: string };
      if (!response.ok || typeof result.favorited !== "boolean") throw new Error(result.error || "Favori güncellenemedi.");
      setFavorited(result.favorited);
      showToast(result.favorited ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Favori güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="favorite-control"><button className={`favorite-button ${favorited ? "active" : ""}`} type="button" onClick={toggle} disabled={loading} aria-pressed={favorited} aria-label={favorited ? "Favorilerden çıkar" : "Favorile"}>{favorited ? "♥" : "♡"}<span>{favorited ? "Favorilerden çıkar" : "Favorile"}</span></button>{error ? <span role="alert">{error}</span> : null}</div>;
}
