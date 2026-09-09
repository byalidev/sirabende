import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../server/requests/actor";
import { markAllNotificationsRead } from "../../../../server/notifications/repository";

export async function PATCH() {
  try {
    const actor = await getRequestActor();
    await markAllNotificationsRead(actor.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notifications update failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Bildirimler güncellenirken bir hata oluştu." }, { status: 500 });
  }
}
