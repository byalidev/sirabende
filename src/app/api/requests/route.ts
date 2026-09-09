import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getRequestActor } from "../../../server/requests/actor";
import { createRequest, getActiveCategoryId } from "../../../server/requests/repository";
import { RequestValidationError, validateCreateRequest } from "../../../server/requests/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateCreateRequest(body);
    const categoryId = await getActiveCategoryId(input.categorySlug);
    const actor = await getRequestActor();
    const createdRequest = await createRequest({ ...input, categoryId }, actor.id);

    revalidatePath("/talepler");
    revalidatePath(`/talepler/${createdRequest.id}`);

    return NextResponse.json({ id: createdRequest.id }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Request creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Talep oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
