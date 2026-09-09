"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportStatusForm({ id, current }: { id: string; current: string }) { const router = useRouter(); const [status, setStatus] = useState(current); const [error, setError] = useState(""); const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(""); const response = await fetch(`/api/admin/reports/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) }); if (!response.ok) { const body = await response.json(); setError(body.error ?? "Durum güncellenemedi."); return; } router.refresh(); }; return <form className="admin-status-form" onSubmit={submit}><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="PENDING">PENDING</option><option value="REVIEWING">REVIEWING</option><option value="RESOLVED">RESOLVED</option><option value="REJECTED">REJECTED</option></select><button className="button-primary" type="submit">Durumu kaydet</button>{error ? <small className="admin-form-error">{error}</small> : null}</form>; }
