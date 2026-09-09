"use client";

export default function PanelError() {
  return <div className="dashboard-error" role="alert"><span className="eyebrow">Bir sorun oluştu</span><h1>Panel verileri yüklenemedi.</h1><p>Lütfen biraz sonra tekrar deneyin.</p><button className="button-primary" type="button" onClick={() => window.location.reload()}>Tekrar dene ↻</button></div>;
}
