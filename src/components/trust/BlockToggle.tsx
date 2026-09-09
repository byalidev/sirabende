"use client";

import { useState } from "react";

export function BlockToggle({ userId, initialBlocked = false }: { userId: string; initialBlocked?: boolean }) {
  const [blocked, setBlocked] = useState(initialBlocked);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const toggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/users/${userId}/block`, { method: blocked ? "DELETE" : "POST" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Engelleme işlemi başarısız.");
      setBlocked(!blocked);
      setMessage(!blocked ? "Kullanıcı engellendi." : "Kullanıcı engeli kaldırıldı.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İşlem başarısız.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="trust-action"><button className="trust-text-button" type="button" onClick={toggle} disabled={loading}>{blocked ? "Engeli Kaldır" : "Kullanıcıyı Engelle"}</button>{message ? <span className="trust-feedback" role="status">{message}</span> : null}</div>;
}
