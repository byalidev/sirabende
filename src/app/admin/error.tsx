"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="dashboard-error"><span className="eyebrow">Admin paneli</span><h1>Veriler yüklenemedi.</h1><p>Beklenmeyen bir hata oluştu.</p><button className="button-primary" type="button" onClick={() => reset()}>Tekrar dene</button></div>; }
