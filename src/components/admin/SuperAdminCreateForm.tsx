"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiResponse } from "./api-response";

export function SuperAdminCreateForm() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget); try { const response = await fetch("/api/admin/super/users", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: form.get("username"), email: form.get("email"), password: form.get("password") }) }); const body = await readApiResponse<{ error?: string }>(response); if (!response.ok) throw new Error(body.error ?? "Admin oluşturulamadı."); event.currentTarget.reset(); setMessage("Admin oluşturuldu."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Admin oluşturulamadı."); } finally { setBusy(false); } };
  return <form className="admin-toolbar" onSubmit={submit}><input name="username" placeholder="Admin kullanıcı adı" required /><input name="email" type="email" placeholder="E-posta" required /><input name="password" type="password" minLength={8} placeholder="Şifre" required /><button className="button-primary" type="submit" disabled={busy}>{busy ? "Oluşturuluyor..." : "Admin oluştur"}</button>{message ? <span role="status">{message}</span> : null}</form>;
}