import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageComposer } from "../../../components/messaging/MessageComposer";
import { getRequestActor } from "../../../server/requests/actor";
import { ConversationAccessError, getConversationForActor } from "../../../server/conversations/repository";
import { requireUser } from "../../../server/auth/auth";
import { redirect } from "next/navigation";

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
  const otherName = participantName(conversation, actor.id);

  return <main className="conversation-detail-page"><header className="conversation-detail-header"><Link className="back-link dark" href="/mesajlar">← Mesajlara dön</Link><div className="conversation-person"><span className="conversation-avatar">{otherName.slice(0, 1).toUpperCase()}</span><div><h1>{otherName}</h1><p>{conversation.request?.title || "Talep bağlantısı yok"}{conversation.offer ? ` · ${new Intl.NumberFormat("tr-TR").format(Number(conversation.offer.price))} TL teklif` : ""}</p></div></div></header><section className="message-thread" aria-label="Mesaj geçmişi">{conversation.messages.length ? conversation.messages.map((message) => <div className={`message-row ${message.senderId === actor.id ? "mine" : "theirs"}`} key={message.id}><div className="message-bubble"><p>{message.content}</p><time dateTime={message.createdAt}>{new Intl.DateTimeFormat("tr-TR", { timeStyle: "short" }).format(new Date(message.createdAt))}</time></div></div>) : <div className="message-thread-empty"><p>Bu konuşmada henüz mesaj yok.</p><span>İlk mesajı gönder.</span></div>}</section><MessageComposer conversationId={conversation.id} /></main>;
}
