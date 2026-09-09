"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestStatusForm({ id, current }: { id: string; current: string }) { const router = useRouter(); const [status, setStatus] = useState(current); const [error, setError] = useState(""); const submit = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch(`/api/admin/requests/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) }); if (!response.ok) { const body = await response.json(); setError(body.error ?? "Durum güncellenemedi."); return; } router.refresh(); }; return <form className="admin-status-form" onSubmit={submit}><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ACTIVE">ACTIVE</option><option value="CLOSED">CLOSED</option><option value="COMPLETED">COMPLETED</option><option value="EXPIRED">EXPIRED</option><option value="CANCELLED">CANCELLED</option></select><button className="button-primary" type="submit">Durumu kaydet</button>{error ? <small className="admin-form-error">{error}</small> : null}</form>; }
