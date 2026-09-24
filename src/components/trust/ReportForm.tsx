"use client";

import { useState } from "react";

const reasons = [
  ["SPAM", "Spam"],
  ["SCAM_SUSPECTED", "Dolandırıcılık şüphesi"],
  ["MISLEADING", "Yanıltıcı bilgi"],
  ["INAPPROPRIATE", "Uygunsuz içerik"],
  ["OTHER", "Diğer"],
] as const;

type TargetType = "USER" | "REQUEST" | "OFFER" | "MESSAGE";

export function ReportForm({ targetType, targetId }: { targetType: TargetType; targetId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof reasons)[number][0]>("SPAM");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetType, targetId, reason, description }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Şikayet gönderilemedi.");
      setMessage("Şikayetiniz alındı.");
      setOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Şikayet gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="trust-action"><button className="trust-text-button" type="button" onClick={() => setOpen((value) => !value)}>Şikayet Et</button>{open ? <div className="trust-inline-form"><label htmlFor={`report-reason-${targetId}`}>Neden</label><select id={`report-reason-${targetId}`} value={reason} onChange={(event) => setReason(event.target.value as (typeof reasons)[number][0])}>{reasons.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="İsterseniz açıklama ekleyin" maxLength={1000} /><button className="button-primary" type="button" onClick={submit} disabled={loading}>{loading ? "Gönderiliyor..." : "Gönder"}</button></div> : null}{message ? <span className="trust-feedback" role="status">{message}</span> : null}</div>;
}
