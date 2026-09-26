import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConversationListItem } from "../../../components/messaging/ConversationListItem";
import { MessageComposer } from "../../../components/messaging/MessageComposer";
import { MessageThread } from "../../../components/messaging/MessageThread";
import { ReportForm } from "../../../components/trust/ReportForm";
import { TrustScoreBadge } from "../../../components/trust/TrustScoreBadge";
import { getMessageDateLabel, formatMessageReadState } from "../../../lib/messaging-format";
import { requireUser } from "../../../server/auth/auth";
import { ConversationAccessError, getConversationForActor, getConversationsForActor } from "../../../server/conversations/repository";
import { getRequestActor } from "../../../server/requests/actor";

export const dynamic = "force-dynamic";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function participantName(conversation: Awaited<ReturnType<typeof getConversationForActor>>, actorId: string) {
  const participant = conversation.buyerId === actorId ? conversation.seller : conversation.buyer;
  return participant.firstName || participant.username;
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();
  try { await requireUser(); } catch { redirect("/giris"); }
  const actor = await getRequestActor();
  let conversation;
  try {
    conversation = await getConversationForActor(id, actor.id);
  } catch (error) {
    if (error instanceof ConversationAccessError) notFound();
    throw error;
  }

  const conversations = await getConversationsForActor(actor.id);
  const otherName = participantName(conversation, actor.id);
  const currentOfferText = conversation.offer ? `Teklif: ${new Intl.NumberFormat("tr-TR").format(Number(conversation.offer.price))} TL` : "Teklif bilgisi yok";

  return (
    <main className="conversation-shell">
      <aside className="conversation-sidebar">
        <div className="conversation-sidebar-header">
          <div>
            <span className="eyebrow">Mesajlar</span>
            <h2>Konuşmalar</h2>
          </div>
          <Link className="back-link dark" href="/panel">Panele dön</Link>
        </div>
        <div className="conversation-list">
          {conversations.map((item) => (
            <ConversationListItem key={item.id} conversation={item} actorId={actor.id} active={item.id === conversation.id} />
          ))}
        </div>
      </aside>

      <section className="conversation-panel">
        <header className="conversation-detail-header">
          <Link className="back-link dark" href="/mesajlar">← Mesajlara dön</Link>
          <div className="conversation-header-personal">
            <div className="conversation-person">
              <span className="conversation-avatar">{otherName.slice(0, 1).toUpperCase()}</span>
              <div>
                <h1>{otherName}</h1>
                <p>{conversation.request?.title || "Talep bağlantısı yok"}</p>
              </div>
            </div>
            <TrustScoreBadge trustScore={conversation.counterpartyTrustScore} />
          </div>
        </header>

        <div className="conversation-context-card">
          <div className="conversation-context-header">
            <span className="eyebrow">Konuşma</span>
            <span className="conversation-context-pill">{conversation.request?.title || "Talep"}</span>
          </div>
          <strong>{conversation.request?.title || "Talep bilgisi bulunamadı"}</strong>
          <div className="conversation-context-meta">
            {conversation.offer ? <span>{new Intl.NumberFormat("tr-TR").format(Number(conversation.offer.price))} TL • {conversation.request?.title ? "İzmir" : "Konum bilgisi yok"}</span> : null}
            <span>{currentOfferText}</span>
          </div>
        </div>

        <MessageThread messageIds={conversation.messages.map((message) => message.id)}>
          {conversation.messages.length ? (
            conversation.messages.map((message, index) => {
              const previousMessage = conversation.messages[index - 1];
              const shouldShowDate = !previousMessage || new Date(previousMessage.createdAt).toDateString() !== new Date(message.createdAt).toDateString();
              const isMine = message.senderId === actor.id;
              const status = formatMessageReadState({ sentByMe: isMine, readAt: message.readAt });

              return (
                <div key={message.id}>
                  {shouldShowDate ? <div className="message-date-divider"><span>{getMessageDateLabel(message.createdAt)}</span></div> : null}
                  <div className={`message-row ${isMine ? "mine" : "theirs"}`}>
                    <div className="message-bubble">
                      <p>{message.content}</p>
                      <div className="message-meta">
                        <time dateTime={message.createdAt}>{new Intl.DateTimeFormat("tr-TR", { timeStyle: "short" }).format(new Date(message.createdAt))}</time>
                        {isMine ? <span className={`message-status ${status === "read" ? "read" : "sent"}`}>{status === "read" ? "✓✓" : "✓"}</span> : null}
                      </div>
                      {!isMine ? <ReportForm targetType="MESSAGE" targetId={message.id} /> : null}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="message-thread-empty">
              <p>Bu konuşmada henüz mesaj yok.</p>
              <span>İlk mesajı gönder.</span>
            </div>
          )}
        </MessageThread>

        <MessageComposer conversationId={conversation.id} hasModerationWarning={conversation.hasModerationWarning} />
      </section>
    </main>
  );
}
