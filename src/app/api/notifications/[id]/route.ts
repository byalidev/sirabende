import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../server/requests/actor";
import { NotificationAccessError, markNotificationRead } from "../../../../server/notifications/repository";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) return NextResponse.json({ error: "Geçersiz bildirim bağlantısı." }, { status: 400 });
    const actor = await getRequestActor();
    await markNotificationRead(id, actor.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NotificationAccessError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("Notification update failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Bildirim güncellenirken bir hata oluştu." }, { status: 500 });
  }
}
