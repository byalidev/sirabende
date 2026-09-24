import { NextResponse } from "next/server";
import { deleteAdminOffer } from "../../../../../server/admin/repository";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await deleteAdminOffer((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Teklif bulunamadı." }, { status: 404 });
    console.error("Admin offer delete failed", error);
    return NextResponse.json({ error: "Teklif silinemedi." }, { status: 500 });
  }
}