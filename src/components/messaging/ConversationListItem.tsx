import Link from "next/link";
import type { ConversationListItem } from "../../server/conversations/repository";

function participantName(conversation: ConversationListItem, actorId: string) {
  const participant = conversation.buyerId === actorId ? conversation.seller : conversation.buyer;
  return participant.firstName || participant.username;
}

export function ConversationListItem({ conversation, actorId, active = false }: { conversation: ConversationListItem; actorId: string; active?: boolean }) {
  return <Link className={`conversation-list-item ${active ? "active" : ""}`} href={`/mesajlar/${conversation.id}`}><span className="conversation-avatar">{participantName(conversation, actorId).slice(0, 1).toUpperCase()}</span><span className="conversation-list-copy"><strong>{participantName(conversation, actorId)}</strong><small>{conversation.request?.title || "Talep bağlantısı yok"}</small><span>{conversation.lastMessage?.content || "Henüz mesaj yok."}</span></span>{conversation.unreadCount > 0 ? <b className="conversation-unread">{conversation.unreadCount}</b> : null}</Link>;
}
