import Link from "next/link";
import { formatConversationTime } from "../../lib/messaging-format";
import type { ConversationListItem } from "../../server/conversations/repository";

function participantName(conversation: ConversationListItem, actorId: string) {
  const participant = conversation.buyerId === actorId ? conversation.seller : conversation.buyer;
  return participant.firstName || participant.username;
}

export function ConversationListItem({ conversation, actorId, active = false }: { conversation: ConversationListItem; actorId: string; active?: boolean }) {
  const participant = participantName(conversation, actorId);
  const lastMessageAt = conversation.lastMessage?.createdAt ? formatConversationTime(conversation.lastMessage.createdAt) : "Yeni";

  return (
    <Link className={`conversation-list-item ${active ? "active" : ""}`} href={`/mesajlar/${conversation.id}`}>
      <span className="conversation-avatar">{participant.slice(0, 1).toUpperCase()}</span>
      <span className="conversation-list-copy">
        <span className="conversation-list-topline">
          <strong>{participant}</strong>
          <time>{lastMessageAt}</time>
        </span>
        <small>{conversation.request?.title || "Talep bağlantısı yok"}</small>
        <span className="conversation-list-preview">{conversation.lastMessage?.content || "Henüz mesaj yok."}</span>
      </span>
      {conversation.unreadCount > 0 ? <b className="conversation-unread">{conversation.unreadCount}</b> : null}
    </Link>
  );
}
