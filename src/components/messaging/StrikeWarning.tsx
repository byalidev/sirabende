import { AlertTriangle, ShieldAlert } from "lucide-react";
import { strikeLevelLabels, strikeReasonLabels } from "../../server/strikes/repository";
import type { PublicStrikeWarning } from "../../server/strikes/repository";

export function StrikeWarning({ warning }: { warning: Exclude<PublicStrikeWarning, null> }) {
  const high = warning.level === "HIGH";
  return <aside className={`conversation-strike-warning ${warning.level.toLowerCase()}`} aria-label="Kullanıcı yaptırım uyarısı"><div className="conversation-strike-warning-icon">{high ? <ShieldAlert aria-hidden="true" size={19} /> : <AlertTriangle aria-hidden="true" size={19} />}</div><div><strong>{high ? "Önemli kullanıcı uyarısı" : "Kullanıcı uyarısı"}</strong><p>Bu kullanıcı daha önce platform kuralları nedeniyle yaptırım almıştır. {strikeLevelLabels[warning.level]} seviye yaptırım sayısı: {warning.count}.</p><ul>{warning.strikes.map((strike, index) => <li key={`${strike.reason}-${strike.createdAt}-${index}`}>{strikeReasonLabels[strike.reason]} <span>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(strike.createdAt))}</span></li>)}</ul></div></aside>;
}
