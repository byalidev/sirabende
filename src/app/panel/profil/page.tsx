import { requireUser } from "../../../server/auth/auth";
import { getUserModerationHistory } from "../../../server/admin/repository";
import { getTrustScore } from "../../../server/strikes/repository";
import { ProfileForm } from "../../../components/dashboard/ProfileForm";
import { TrustScoreBadge } from "../../../components/trust/TrustScoreBadge";

export default async function ProfilePage() {
  const user = await requireUser();
  const [history, trustScore] = await Promise.all([getUserModerationHistory(user.id), getTrustScore(user.id)]);
  const now = new Date();
  const sanctionLabels = { GENERAL_BAN: "genel kullanım", POSTING_BAN: "ilan paylaşma", OFFERING_BAN: "teklif verme", ACCOUNT_DEACTIVATION: "hesap kullanımı" } as const;
  const activeSanctions = [
    { type: "GENERAL_BAN" as const, label: "Genel ban", until: user.bannedUntil },
    { type: "POSTING_BAN" as const, label: "İlan paylaşma yasağı", until: user.postingBannedUntil },
    { type: "OFFERING_BAN" as const, label: "Teklif yasağı", until: user.offeringBannedUntil },
  ].filter((item) => item.until && item.until > now).map((item) => ({ ...item, action: history.find((action) => action.type === item.type) }));
  const hasAccountBan = !user.isActive;
  return <div className="dashboard-page"><header className="dashboard-page-header"><div><span className="eyebrow">Hesap ayarları</span><h1>Profilim</h1><p>Kişisel bilgilerini ve hesap şifreni yönet.</p></div><TrustScoreBadge trustScore={trustScore} /></header>{activeSanctions.length || hasAccountBan ? <section className="profile-sanction-alert"><strong>Yasaklı</strong>{hasAccountBan ? <p>Hesap kullanımı süresiz olarak yasaklanmıştır. Sebep: {history.find((action) => action.type === "ACCOUNT_DEACTIVATION")?.reason ?? "Belirtilmedi."}</p> : null}{activeSanctions.map((sanction) => <p key={sanction.label}>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(sanction.until as Date)} tarihine kadar {sanctionLabels[sanction.type]} yasağı almıştır. Sebep: {sanction.action?.reason ?? "Belirtilmedi."}</p>)}</section> : null}<ProfileForm user={{ firstName: user.firstName ?? "", lastName: user.lastName ?? "", username: user.username, email: user.email, phone: user.phone ?? "" }} />{history.length ? <section className="dashboard-panel-section profile-sanction-history"><h2>Yaptırım kayıtlarım</h2>{history.map((action) => <article key={action.id}><strong>{action.type === "GENERAL_BAN" ? "Genel ban" : action.type === "POSTING_BAN" ? "İlan paylaşma yasağı" : action.type === "OFFERING_BAN" ? "Teklif yasağı" : "Hesap kapatma"}</strong><p>{action.reason}</p><small>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(action.createdAt)}{action.endsAt ? ` · ${new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(action.endsAt)} tarihine kadar` : ""}</small></article>)}</section> : null}</div>;
}
