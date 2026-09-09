"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); const data = await response.json(); if (!response.ok) setError(data.error || "Kayıt yapılamadı."); else router.push("/panel"); setLoading(false); }
  return <main className="auth-page"><section className="auth-card auth-card-wide"><Link className="brand auth-brand" href="/"><span className="brand-mark">S</span><span>SıraBende</span></Link><span className="eyebrow">Aramıza katıl</span><h1>Hesabını oluştur.</h1><form onSubmit={submit} className="auth-form auth-form-grid"><label>Ad<input name="firstName" required autoComplete="given-name" /></label><label>Soyad<input name="lastName" required autoComplete="family-name" /></label><label>Kullanıcı adı<input name="username" required autoComplete="username" /></label><label>E-posta<input name="email" type="email" required autoComplete="email" /></label><label>Telefon<input name="phone" required autoComplete="tel" /></label><label>Şifre<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label><label>Şifre tekrar<input name="passwordConfirmation" type="password" minLength={8} required autoComplete="new-password" /></label>{error ? <p className="form-error auth-form-full" role="alert">{error}</p> : null}<button className="button-primary auth-form-full" type="submit" disabled={loading}>{loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}</button></form><p className="auth-switch">Zaten hesabın var mı? <Link href="/giris">Giriş Yap</Link></p></section></main>;
}
