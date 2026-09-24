"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { showToast } from "../ui/toast";
import { MessageSafetyNotice } from "./MessageSafetyNotice";

export function MessageComposer({ conversationId, hasModerationWarning = false }: { conversationId: string; hasModerationWarning?: boolean }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Mesaj gönderilemedi.");
      setContent("");
      showToast("Mesaj gönderildi");
      router.refresh();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setSending(false);
    }
  };

  return <form className="message-composer" onSubmit={sendMessage}><MessageSafetyNotice hasModerationWarning={hasModerationWarning} /><textarea aria-label="Mesaj" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Mesajını yaz..." maxLength={2000} /><div className="message-composer-footer"><span>{content.length}/2.000</span><button className="button-primary" type="submit" disabled={sending || !content.trim()}>{sending ? "Gönderiliyor..." : "Gönder ↗"}</button></div>{error ? <p className="form-error" role="alert">{error}</p> : null}</form>;
}
