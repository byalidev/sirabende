import { AlertTriangle, Eye, ShieldCheck } from "lucide-react";

export function MessageSafetyNotice({ hasModerationWarning = false }: { hasModerationWarning?: boolean }) {
  return <aside className={`message-safety-notice${hasModerationWarning ? " has-warning" : ""}`} aria-label="Mesaj güvenliği bilgilendirmesi">
    <div className="message-safety-icon">{hasModerationWarning ? <AlertTriangle aria-hidden="true" size={18} /> : <ShieldCheck aria-hidden="true" size={18} />}</div>
    <div className="message-safety-copy"><strong>{hasModerationWarning ? "Mesaj kurallarına dikkat edelim" : "Mesajlar güvenlik amacıyla denetlenebilir"}</strong><p>{hasModerationWarning ? "Bu konuşmada kurallara aykırı olabilecek bir içerik işaretlendi. Lütfen iletişimini saygılı ve platform içinde sürdür." : "Mesajlar, güvenliği korumak için yetkili ekipler tarafından okunabilir."}</p><details><summary>Genel kurallar</summary><ul><li>Telefon, IBAN, banka bilgisi veya şifre paylaşma.</li><li>WhatsApp, Telegram ve benzeri platformlara yönlendirme yapma.</li><li>Hakaret, tehdit ve şüpheli ödeme taleplerinden kaçın.</li><li>Şüpheli mesajları mesaj içindeki şikayet seçeneğiyle bildir.</li></ul><a href="/message-rules.txt" target="_blank" rel="noreferrer">Kuralların tamamını görüntüle</a></details></div><Eye className="message-safety-eye" aria-hidden="true" size={17} /></aside>;
}
