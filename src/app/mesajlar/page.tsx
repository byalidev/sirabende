import Link from "next/link";
import { ConversationListItem } from "../../components/messaging/ConversationListItem";
import { MessageSafetyNotice } from "../../components/messaging/MessageSafetyNotice";
import { DashboardEmptyState } from "../../components/dashboard/DashboardEmptyState";
import { getRequestActor } from "../../server/requests/actor";
import { getConversationsForActor } from "../../server/conversations/repository";
import { requireUser } from "../../server/auth/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  try { await requireUser(); } catch { redirect("/giris"); }
  const actor = await getRequestActor();
  const conversations = await getConversationsForActor(actor.id);
  return <main className="messages-page"><header className="messages-page-header"><div><Link className="back-link dark" href="/panel">← Panele dön</Link><span className="eyebrow">İletişim</span><h1>Mesajlar</h1><p>Teklifler üzerinden başlayan konuşmalarını takip et.</p></div><Link className="button-quiet" href="/talepler">Talep keşfet ↗</Link></header><MessageSafetyNotice /><section className="conversation-page-card">{conversations.length ? <div className="conversation-list">{conversations.map((conversation) => <ConversationListItem conversation={conversation} actorId={actor.id} key={conversation.id} />)}</div> : <DashboardEmptyState title="Henüz bir konuşman yok." description="Bir teklif üzerinden iletişim başlatabilirsin." href="/talepler" action="Talep keşfet" />}</section></main>;
}
