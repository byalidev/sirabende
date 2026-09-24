"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiResponse } from "./api-response";

export function AdminDeleteButton({ endpoint, label }: { endpoint: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function remove() {
    if (!window.confirm(`${label} silinsin mi? Bu işlem geri alınamaz.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const result = await readApiResponse<{ error?: string }>(response);
      if (!response.ok) throw new Error(result.error ?? "Silme işlemi başarısız.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Silme işlemi başarısız.");
      setBusy(false);
    }
  }

  return <span><button className="admin-danger-button" type="button" onClick={remove} disabled={busy}>{busy ? "Siliniyor..." : "Sil"}</button>{message ? <small className="admin-form-error" role="alert">{message}</small> : null}</span>;
}