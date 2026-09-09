import { NextResponse } from "next/server";
import { ConversationAccessError } from "../../../../../server/conversations/repository";
import { getRequestActor } from "../../../../../server/requests/actor";
import { createMessage } from "../../../../../server/messages/repository";
import { MessageValidationError, validateMessageContent } from "../../../../../server/messages/validation";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) return NextResponse.json({ error: "Geçersiz konuşma bağlantısı." }, { status: 400 });
    const content = validateMessageContent(await request.json());
    const actor = await getRequestActor();
    const message = await createMessage(id, actor.id, content);
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof MessageValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof ConversationAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("Message creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Mesaj gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
