"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readApiResponse } from "./api-response";

export function UserRoleControls({ id, currentRole }: { id: string; currentRole: "USER" | "ADMIN" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function update(nextRole: "USER" | "ADMIN") {
    if (nextRole === currentRole) return;
    const confirmationMessage = nextRole === "ADMIN" ? "Bu kullanıcıya admin yetkisi verilsin mi?" : "Bu kullanıcının admin yetkisi geri alınsın mı?";
    if (!window.confirm(confirmationMessage)) return;

    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });

      const result = await readApiResponse<{ error?: string }>(response);
      if (!response.ok) throw new Error(result.error ?? "Yetki güncellemesi başarısız.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yetki güncellemesi başarısız.");
    } finally {
      setBusy(false);
    }
  }

  return <span>
    <button className="admin-row-link" type="button" disabled={busy || currentRole === "ADMIN"} onClick={() => update("ADMIN")}>ADMIN yap</button>
    <button className="admin-row-link admin-danger-button" type="button" disabled={busy || currentRole === "USER"} onClick={() => update("USER")}>USER yap</button>
    {message ? <small className="admin-form-error" role="alert">{message}</small> : null}
  </span>;
}
