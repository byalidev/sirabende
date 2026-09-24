"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readApiResponse } from "./api-response";

const reasons = {
  LOW: [["SPAM", "Spam"], ["UNNECESSARY_MESSAGE", "Gereksiz mesaj"], ["WRONG_CATEGORY", "Yanlış kategori"], ["MINOR_PROFILE_VIOLATION", "Küçük profil ihlali"]],
  MEDIUM: [["MISLEADING_PRODUCT_INFO", "Yanlış ürün bilgisi"], ["FAKE_REQUEST", "Sahte talep"], ["REPEATED_SPAM", "Sürekli spam"], ["FAKE_REVIEW", "Sahte değerlendirme"], ["OFF_PLATFORM_REDIRECTION", "Platform dışına yönlendirme"]],
  HIGH: [["FRAUD", "Dolandırıcılık"], ["FAKE_IDENTITY", "Sahte kimlik"], ["FAKE_BUSINESS", "Sahte işletme"], ["THREAT", "Tehdit"], ["BLACKMAIL", "Şantaj"], ["PERSONAL_DATA_MISUSE", "Kişisel bilgileri kötüye kullanma"], ["PROHIBITED_PRODUCT", "Yasaklı ürün"]],
} as const;

type Level = keyof typeof reasons;

export function AdminStrikeForm({ userId }: { userId: string }) {
  const router = useRouter(); const [level, setLevel] = useState<Level>("LOW"); const [reason, setReason] = useState<(typeof reasons)[Level][number][0]>("SPAM"); const [adminNote, setAdminNote] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const changeLevel = (value: Level) => { setLevel(value); setReason(reasons[value][0][0]); };
  const submit = async () => { if (!window.confirm("Bu kullanıcıya yaptırım uygulamak istediğinize emin misiniz?")) return; setBusy(true); setMessage(""); try { const response = await fetch(`/api/admin/users/${userId}/strikes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ level, reason, adminNote }) }); const body = await readApiResponse<{ error?: string; permanentlySuspend?: boolean }>(response); if (!response.ok) throw new Error(body.error ?? "Yaptırım uygulanamadı."); setAdminNote(""); setMessage(body.permanentlySuspend ? "Yaptırım uygulandı ve hesap kalıcı olarak kapatıldı." : "Yaptırım kaydedildi."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Yaptırım uygulanamadı."); } finally { setBusy(false); } };
  return <div className="admin-strike-form"><div className="admin-moderation-grid"><label><span>Yaptırım seviyesi</span><select value={level} onChange={(event) => changeLevel(event.target.value as Level)}><option value="LOW">Düşük</option><option value="MEDIUM">Orta</option><option value="HIGH">Yüksek</option></select></label><label><span>Yaptırım sebebi</span><select value={reason} onChange={(event) => setReason(event.target.value as typeof reason)}>{reasons[level].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><label><span>Açıklama</span><textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} maxLength={2000} placeholder="Yaptırım uygulanan kullanıcının görebileceği açıklama" /></label><button className="button-primary" type="button" disabled={busy} onClick={submit}>{busy ? "Kaydediliyor..." : "Yaptırımı kaydet"}</button>{message ? <p className="admin-note" role="status">{message}</p> : null}</div>;
}
