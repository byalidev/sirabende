"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiResponse } from "./api-response";

export function SuperAdminSanctionControls({ userId, strikeId }: { userId: string; strikeId?: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const remove = async (endpoint: string, prompt: string) => { if (!window.confirm(prompt)) return; setBusy(true); setMessage(""); try { const response = await fetch(endpoint, { method: "DELETE" }); const body = await readApiResponse<{ error?: string }>(response); if (!response.ok) throw new Error(body.error ?? "İşlem başarısız."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "İşlem başarısız."); } finally { setBusy(false); } };
  return <span><button className="admin-danger-button" type="button" disabled={busy} onClick={() => remove(`/api/admin/super/users/${userId}/bans`, "Bu kullanıcının tüm aktif yasakları kaldırılsın mı?")}>Yasakları kaldır</button>{strikeId ? <button className="admin-danger-button" type="button" disabled={busy} onClick={() => remove(`/api/admin/super/strikes/${strikeId}`, "Bu yaptırım geri çekilsin mi?")}>Cezayı geri çek</button> : null}{message ? <small className="admin-form-error" role="alert">{message}</small> : null}</span>;
}