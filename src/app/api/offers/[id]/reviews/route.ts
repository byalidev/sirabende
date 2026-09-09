import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../../server/requests/actor";
import { createReview, ReviewDomainError } from "../../../../../server/reviews/repository";
import { ReviewValidationError, validateReviewInput } from "../../../../../server/reviews/validation";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) return NextResponse.json({ error: "Geçersiz teklif bağlantısı." }, { status: 400 });
    const input = validateReviewInput(await request.json());
    const actor = await getRequestActor();
    const review = await createReview(id, actor.id, input.rating, input.comment);
    return NextResponse.json({ review: { ...review, createdAt: review.createdAt.toISOString() } }, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof ReviewDomainError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Review creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Değerlendirme oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}
