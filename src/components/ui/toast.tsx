"use client";

import { useEffect, useState } from "react";

type ToastItem = { id: number; message: string; type: "success" | "error" };

export function showToast(message: string, type: "success" | "error" = "success") {
  window.dispatchEvent(new CustomEvent("sirabende-toast", { detail: { message, type } }));
}

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; type: "success" | "error" }>).detail;
      const id = Date.now() + Math.random();
      setItems((current) => [...current.slice(-3), { id, message: detail.message, type: detail.type }]);
      window.setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4200);
    };
    window.addEventListener("sirabende-toast", onToast);
    return () => window.removeEventListener("sirabende-toast", onToast);
  }, []);

  if (!items.length) return null;

  return (
    <div className="toast-stack" role="region" aria-live="polite" aria-label="Bildirimler">
      {items.map((item) => (
        <div className={`toast-item toast-${item.type}`} key={item.id} role="status">
          <span>{item.type === "success" ? "✓" : "!"}</span>
          <p>{item.message}</p>
          <button type="button" aria-label="Kapat" onClick={() => setItems((current) => current.filter((toast) => item.id !== toast.id))}>×</button>
        </div>
      ))}
    </div>
  );
}
