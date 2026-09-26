"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "../../components/navigation/BrandLogo";

const RESEND_COOLDOWN_MS = 40_000;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldownEndsAt, setResendCooldownEndsAt] = useState<number | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  useEffect(() => {
    if (resendCooldownEndsAt === null) return;

    const updateCountdown = () => {
      const remainingMs = Math.max(0, resendCooldownEndsAt - Date.now());
      const nextSeconds = Math.ceil(remainingMs / 1000);
      setCountdownSeconds(nextSeconds);

      if (remainingMs === 0) {
        setCountdownSeconds(0);
        setResendCooldownEndsAt(null);
      }
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [resendCooldownEndsAt]);

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
    if (resending || (resendCooldownEndsAt !== null && countdownSeconds > 0)) return;

    setResending(true);
    setError("");
    setInfo("");

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Kod gönderilemedi.");
    } else {
      setInfo("Yeni doğrulama kodu gönderildi.");
      const nextCooldownEndsAt = Date.now() + RESEND_COOLDOWN_MS;
      setResendCooldownEndsAt(nextCooldownEndsAt);
      setCountdownSeconds(Math.ceil(RESEND_COOLDOWN_MS / 1000));
    }

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
        <button
          type="button"
          className="button-secondary auth-form-full"
          onClick={resend}
          disabled={resending || (resendCooldownEndsAt !== null && countdownSeconds > 0)}
        >
          {resending
            ? "Gönderiliyor..."
            : resendCooldownEndsAt !== null && countdownSeconds > 0
              ? `Tekrar Kod Gönder (${countdownSeconds}s)`
              : "Tekrar Kod Gönder"}
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
