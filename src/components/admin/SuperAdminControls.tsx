"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiResponse } from "./api-response";

export function SuperAdminControls({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const update = async (body: Record<string, unknown>) => { setBusy(true); setMessage(""); try { const response = await fetch(`/api/admin/super/users/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const result = await readApiResponse<{ error?: string }>(response); if (!response.ok) throw new Error(result.error ?? "İşlem başarısız."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "İşlem başarısız."); } finally { setBusy(false); } };
  const remove = async () => { if (!window.confirm("Bu admin hesabını silmek istediğinize emin misiniz? Hesap kullanıcı olarak geri dönse de admin yetkisi kaldırılacak.")) return; setBusy(true); setMessage(""); try { const response = await fetch(`/api/admin/super/users/${id}`, { method: "DELETE" }); const result = await readApiResponse<{ error?: string }>(response); if (!response.ok) throw new Error(result.error ?? "Silme işlemi başarısız."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Silme işlemi başarısız."); } finally { setBusy(false); } };
  return <span><button className="admin-row-link" type="button" disabled={busy} onClick={() => update({ isActive: !isActive })}>{isActive ? "Pasifleştir" : "Aktifleştir"}</button> <button className="admin-row-link" type="button" disabled={busy} onClick={() => update({ role: "USER" })}>USER yap</button> <button className="admin-row-link" type="button" disabled={busy} onClick={() => update({ role: "ADMIN" })}>ADMIN yap</button> <button className="admin-row-link admin-danger-button" type="button" disabled={busy} onClick={remove}>Sil</button>{message ? <small className="admin-form-error" role="alert">{message}</small> : null}</span>;
}