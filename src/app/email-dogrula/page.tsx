"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "../../components/navigation/BrandLogo";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(""); setInfo("");
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, code }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Doğrulama başarısız.");
    else router.push("/giris");
    setLoading(false);
  }

  async function resend() {
    if (!identifier) { setError("Önce e-posta veya kullanıcı adınızı girin."); return; }
    setResending(true); setError(""); setInfo("");
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Kod gönderilemedi.");
    else setInfo("Yeni doğrulama kodu gönderildi.");
    setResending(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" href="/"><BrandLogo /></Link>
        <span className="eyebrow">Hesabını doğrula</span>
        <h1>E-postanı doğrula.</h1>
        <p className="auth-intro">E-posta adresine gönderdiğimiz 6 haneli kodu gir.</p>
        <form onSubmit={submit} className="auth-form">
          <label>E-posta veya kullanıcı adı
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required autoComplete="username" />
          </label>
          <label>Doğrulama kodu
            <input value={code} onChange={(event) => setCode(event.target.value)} required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" />
          </label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          {info ? <p className="auth-intro" role="status">{info}</p> : null}
          <button className="button-primary" type="submit" disabled={loading}>{loading ? "Doğrulanıyor..." : "E-postayı Doğrula"}</button>
        </form>
        <button type="button" className="button-secondary auth-form-full" onClick={resend} disabled={resending}>
          {resending ? "Gönderiliyor..." : "Kodu Tekrar Gönder"}
        </button>
        <p className="auth-switch">Zaten doğruladın mı? <Link href="/giris">Giriş Yap</Link></p>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
