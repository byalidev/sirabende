import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../../server/requests/actor";
import { createOffer } from "../../../../../server/offers/repository";
import { OfferDomainError, OfferValidationError, validateCreateOffer } from "../../../../../server/offers/validation";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) {
      return NextResponse.json({ error: "Geçersiz talep bağlantısı." }, { status: 400 });
    }

    const input = validateCreateOffer(await request.json());
    const seller = await getRequestActor();
    const offer = await createOffer(id, seller.id, input);

    revalidatePath(`/talepler/${id}`);
    revalidatePath("/talepler");

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    if (error instanceof OfferValidationError || error instanceof OfferDomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Offer creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Teklif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
