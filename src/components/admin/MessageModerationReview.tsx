"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readApiResponse } from "./api-response";

export function MessageModerationReview({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const update = async (nextStatus: "CONFIRMED" | "REJECTED" | "IN_REVIEW") => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/message-moderation/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: nextStatus, adminNote: note }) });
      const body = await readApiResponse<{ error?: string }>(response);
      if (!response.ok) throw new Error(body.error ?? "Moderasyon durumu güncellenemedi.");
      setMessage("İnceleme durumu kaydedildi.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Moderasyon durumu güncellenemedi.");
    } finally {
      setBusy(false);
    }
  };
  return <div className="message-moderation-review"><strong>{status === "PENDING" ? "İnceleme bekliyor" : status}</strong><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="İsteğe bağlı admin notu" maxLength={2000} /><div><button className="button-quiet" type="button" disabled={busy} onClick={() => update("IN_REVIEW")}>İncelemeye al</button><button className="button-primary" type="button" disabled={busy} onClick={() => update("CONFIRMED")}>Onayla</button><button className="button-quiet" type="button" disabled={busy} onClick={() => update("REJECTED")}>Reddet</button></div>{message ? <small className="admin-note">{message}</small> : null}</div>;
}
