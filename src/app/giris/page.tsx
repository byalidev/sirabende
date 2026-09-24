"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../../components/navigation/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Giriş yapılamadı.");
      if (data.code === "EMAIL_NOT_VERIFIED") router.push(`/email-dogrula?email=${encodeURIComponent(identifier)}`);
    } else router.push("/talepler");
    setLoading(false);
  }
  return <main className="auth-page"><section className="auth-card"><Link className="brand auth-brand" href="/"><BrandLogo /></Link><span className="eyebrow">Hesabına giriş yap</span><h1>Tekliflerini takip et.</h1><p className="auth-intro">Taleplerini, mesajlarını ve bildirimlerini tek yerden yönet.</p><form onSubmit={submit} className="auth-form"><label>E-posta veya kullanıcı adı<input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required autoComplete="username" /></label><label>Şifre<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button-primary" type="submit" disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button></form><p className="auth-switch">Hesabın yok mu? <Link href="/kayit">Üye Ol</Link></p></section></main>;
}
