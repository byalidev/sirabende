import { NextResponse } from "next/server";
import { StrikeLevel, StrikeReason } from "@prisma/client";
import { createStrike, StrikeDomainError } from "../../../../../../server/strikes/repository";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json() as { level?: unknown; reason?: unknown; adminNote?: unknown };
    if (!Object.values(StrikeLevel).includes(body.level as StrikeLevel) || !Object.values(StrikeReason).includes(body.reason as StrikeReason)) return NextResponse.json({ error: "Geçersiz yaptırım seviyesi veya sebebi." }, { status: 400 });
    if (body.adminNote !== undefined && body.adminNote !== null && typeof body.adminNote !== "string") return NextResponse.json({ error: "Admin notu geçersiz." }, { status: 400 });
    const result = await createStrike({ userId: (await params).id, level: body.level as StrikeLevel, reason: body.reason as StrikeReason, adminNote: typeof body.adminNote === "string" ? body.adminNote.trim() : null });
    return NextResponse.json({ strike: { ...result.strike, createdAt: result.strike.createdAt.toISOString() }, permanentlySuspend: result.permanentlySuspend }, { status: 201 });
  } catch (error) {
    if (error instanceof StrikeDomainError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Admin strike creation failed", error);
    return NextResponse.json({ error: "Yaptırım uygulanamadı." }, { status: 500 });
  }
}
