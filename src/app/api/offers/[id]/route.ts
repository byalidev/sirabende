import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getRequestActor } from "../../../../server/requests/actor";
import { deleteOfferBySeller } from "../../../../server/offers/repository";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await getRequestActor();
    const { id } = await params;
    await deleteOfferBySeller(id, actor.id);
    revalidatePath("/panel");
    revalidatePath("/panel/teklifler");
    revalidatePath("/talepler");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.message.includes("yetkiniz") ? 404 : 401;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Teklif silinemedi." }, { status });
  }
}