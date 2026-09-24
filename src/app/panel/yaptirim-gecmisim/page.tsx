import { getRequestActor } from "../../../server/requests/actor";
import { getStrikesForUser, strikeLevelLabels, strikeReasonLabels } from "../../../server/strikes/repository";

export default async function MyStrikeHistoryPage() {
  const actor = await getRequestActor();
  const strikes = await getStrikesForUser(actor.id);
  return <div className="dashboard-page"><header className="dashboard-page-header compact"><div><span className="eyebrow">Hesap geçmişi</span><h1>Yaptırım geçmişim</h1><p>Hesabına uygulanan yaptırımları burada görebilirsin.</p></div></header><section className="dashboard-panel-section">{strikes.length ? <div className="moderation-history">{strikes.map((strike) => <article className="moderation-history-item" key={strike.id}><div><strong>{strikeLevelLabels[strike.level]} seviye yaptırım</strong><p>{strikeReasonLabels[strike.reason]}</p>{strike.adminNote ? <p>{strike.adminNote}</p> : null}</div><small>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(strike.createdAt)} · {strike.status === "ACTIVE" ? "Aktif" : "Geri çekildi"}{strike.endsAt ? ` · ${new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(strike.endsAt)} tarihine kadar` : ""}</small></article>)}</div> : <p className="admin-note">Hesabına uygulanmış yaptırım bulunmuyor.</p>}</section></div>;
}
