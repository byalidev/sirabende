import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageModerationReview } from "../../../../components/admin/MessageModerationReview";
import { getAdminConversationModeration } from "../../../../server/admin/message-moderation";
import { formatDate } from "../../../../components/admin/AdminPageParts";

export default async function AdminMessageModerationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const conversation = await getAdminConversationModeration((await params).id);
  if (!conversation) notFound();
  return <div className="dashboard-page"><Link className="admin-back-link" href="/admin/mesaj-denetimi">← Mesaj denetimine dön</Link><header className="dashboard-page-header compact"><div><span className="eyebrow">Konuşma detayı</span><h1>{conversation.buyer.username} · {conversation.seller.username}</h1><p>Konuşma ID: {conversation.id} · {formatDate(conversation.createdAt)}</p></div></header><section className="admin-message-thread">{conversation.messages.length ? conversation.messages.map((message) => <article className="admin-message-item" key={message.id}><div className="admin-message-meta"><strong>{message.sender.username}</strong><time>{formatDate(message.createdAt)}</time></div><p>{message.content}</p>{message.moderationFlags.length ? <div className="admin-message-flags">{message.moderationFlags.map((flag) => <div className={`admin-message-flag ${flag.severity.toLowerCase()}`} key={flag.id}><strong>{flag.type}</strong><span>{flag.matchedRule}{flag.maskedText ? ` · ${flag.maskedText}` : ""}</span><small>{flag.reviewStatus}</small><MessageModerationReview id={flag.id} status={flag.reviewStatus} /></div>)}</div> : null}{message.reports.length ? <div className="admin-message-report">Raporlayan: {message.reports.map((report) => `${report.reporter.username} · ${report.reason}`).join(" | ")}</div> : null}</article>) : <p className="admin-note">Bu konuşmada mesaj yok.</p>}</section></div>;
}
