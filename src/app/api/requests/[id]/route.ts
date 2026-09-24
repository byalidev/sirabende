import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getRequestActor } from "../../../../server/requests/actor";
import { isRequestFeature, updateRequestFeatureByOwner } from "../../../../server/requests/features";
import { deleteRequestByOwner } from "../../../../server/requests/repository";
import { RequestValidationError } from "../../../../server/requests/validation";
import { AuthError } from "../../../../server/auth/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json() as { feature?: unknown; durationHours?: unknown };
    if (!isRequestFeature(body.feature) || (body.durationHours !== null && (typeof body.durationHours !== "number" || !Number.isInteger(body.durationHours)))) {
      return NextResponse.json({ error: "Geçersiz görünürlük özelliği veya süre." }, { status: 400 });
    }

    const actor = await getRequestActor();
    const { id } = await params;
    const result = await updateRequestFeatureByOwner(id, actor.id, body.feature, body.durationHours);
    revalidatePath("/panel");
    revalidatePath("/panel/talepler");
    revalidatePath("/talepler");
    revalidatePath(`/talepler/${id}`);
    return NextResponse.json({ feature: result.feature, until: result.until?.toISOString() ?? null });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Görünürlük özelliğini kullanmak için tekrar giriş yapmalısınız." }, { status: 401 });
    }
    if (error instanceof RequestValidationError) {
      const quotaReached = error.message === "Haftalık 2 görünürlük kullanım hakkınız doldu.";
      return NextResponse.json({ error: error.message, quotaReached }, { status: quotaReached ? 429 : 400 });
    }
    console.error("Request visibility update failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Talep görünürlüğü güncellenemedi. Lütfen tekrar deneyin." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await getRequestActor();
    const { id } = await params;
    await deleteRequestByOwner(id, actor.id);
    revalidatePath("/panel");
    revalidatePath("/panel/talepler");
    revalidatePath("/talepler");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.message.includes("yetkiniz") ? 404 : 401;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Talep silinemedi." }, { status });
  }
}