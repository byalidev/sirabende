"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readApiResponse } from "./api-response";

function toLocalValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function AdminModerationForm({ id, isActive, bannedUntil, postingBannedUntil, offeringBannedUntil }: { id: string; isActive: boolean; bannedUntil: string | null; postingBannedUntil: string | null; offeringBannedUntil: string | null }) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [general, setGeneral] = useState(toLocalValue(bannedUntil));
  const [posting, setPosting] = useState(toLocalValue(postingBannedUntil));
  const [offering, setOffering] = useState(toLocalValue(offeringBannedUntil));
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: active, bannedUntil: general, postingBannedUntil: posting, offeringBannedUntil: offering, reason }) });
    const result = await readApiResponse<{ error?: string }>(response);
    setMessage(response.ok ? "Yaptırımlar güncellendi." : result.error || "Güncelleme başarısız.");
    setBusy(false);
    if (response.ok) router.refresh();
  }

  return <div className="admin-moderation-form"><div className="admin-moderation-grid"><label><span>Hesap durumu</span><select value={active ? "active" : "inactive"} onChange={(event) => setActive(event.target.value === "active")}><option value="active">Aktif</option><option value="inactive">Genel olarak yasaklı</option></select></label><label><span>Genel ban bitişi</span><input type="datetime-local" value={general} onChange={(event) => setGeneral(event.target.value)} /></label><label><span>İlan paylaşma yasağı bitişi</span><input type="datetime-local" value={posting} onChange={(event) => setPosting(event.target.value)} /></label><label><span>Teklif yasağı bitişi</span><input type="datetime-local" value={offering} onChange={(event) => setOffering(event.target.value)} /></label></div><label><span>Yaptırım nedeni <b>*</b></span><textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Örn. Topluluk kurallarına aykırı içerik" required minLength={3} /></label><button className="button-primary" type="button" onClick={save} disabled={busy || reason.trim().length < 3}>{busy ? "Kaydediliyor..." : "Manuel kısıtlamayı kaydet"}</button>{message ? <p className="admin-note" role="status">{message}</p> : null}</div>;
}
