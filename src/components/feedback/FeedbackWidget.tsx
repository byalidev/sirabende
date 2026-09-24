"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, pageUrl: pathname }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "FEEDBACK_SEND_FAILED");
      }

      setSent(true);
      setMessage("");
      window.setTimeout(() => {
        setSent(false);
        setOpen(false);
      }, 1600);
    } catch (error) {
      setError(error instanceof Error && error.message !== "FEEDBACK_SEND_FAILED"
        ? error.message
        : "Geri bildirim gönderilemedi, tekrar dener misin?");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="feedback-widget">
      {open ? (
        <div className="feedback-panel" role="dialog" aria-label="AI Geri Bildirim">
          <div className="feedback-panel-header">
            <span>Bu sayfa hakkında ne düşünüyorsun?</span>
            <button type="button" className="feedback-close" aria-label="Kapat" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>
          {sent ? (
            <p className="feedback-success">Geri bildirimin alındı.</p>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Önerini veya karşılaştığın sorunu yaz..."
                rows={4}
                required
              />
              {error ? <p className="feedback-error">{error}</p> : null}
              <button type="submit" className="button-primary feedback-submit" disabled={sending}>
                {sending ? "Gönderiliyor..." : "Geri Bildirim Gönder"}
              </button>
            </form>
          )}
        </div>
      ) : null}
      <button
        type="button"
        className="feedback-fab"
        title="AI Geri Bildirim"
        aria-label="AI Geri Bildirim"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
}

