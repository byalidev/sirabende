import { NextResponse } from "next/server";
import { getOrCreateConversationForOffer, ConversationAccessError, ConversationDomainError } from "../../../../../server/conversations/repository";
import { getRequestActor } from "../../../../../server/requests/actor";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) return NextResponse.json({ error: "Geçersiz teklif bağlantısı." }, { status: 400 });
    const actor = await getRequestActor();
    const conversation = await getOrCreateConversationForOffer(id, actor.id);
    return NextResponse.json({ id: conversation.id }, { status: 201 });
  } catch (error) {
    if (error instanceof ConversationAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof ConversationDomainError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Conversation creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Konuşma başlatılırken bir hata oluştu." }, { status: 500 });
  }
}
