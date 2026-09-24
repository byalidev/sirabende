"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ endpoint, label }: { endpoint: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm(`${label} silinsin mi? Bu işlem geri alınamaz.`)) return;
    setBusy(true);
    const response = await fetch(endpoint, { method: "DELETE" });
    if (response.ok) router.refresh();
    else setBusy(false);
  }

  return <button className="dashboard-delete-button" type="button" onClick={remove} disabled={busy}>{busy ? "Siliniyor..." : "Sil"}</button>;
}