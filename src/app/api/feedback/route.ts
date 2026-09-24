import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../server/auth/auth";
import { createPageFeedback } from "../../../server/feedback/repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl : "";
    if (!message) return NextResponse.json({ error: "Geri bildirim metni gerekli." }, { status: 400 });
    const user = await getCurrentUser();
    await createPageFeedback({ message, pageUrl, userId: user?.id ?? null });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Page feedback creation failed", message);

    if (message.includes("10 dakika") || message.includes("dakika sonra")) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    return NextResponse.json({ error: "Geri bildirim gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
