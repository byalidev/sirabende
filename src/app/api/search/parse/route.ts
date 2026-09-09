import { NextResponse } from "next/server";
import { getActiveCategories } from "../../../../server/requests/repository";
import { AiProviderError, AiValidationError, parseSearchIntent } from "../../../../server/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown };
    const categories = await getActiveCategories();
    const result = await parseSearchIntent(body.query, categories.map((item) => item.slug));
    return NextResponse.json({
      filters: result.publicFilters,
      needsClarification: result.needsClarification,
      clarificationQuestion: result.clarificationQuestion,
    });
  } catch (error) {
    if (error instanceof AiValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof AiProviderError) {
      const configured = error.message === "AI servisi yapılandırılmamış.";
      console.error("AI parse unavailable", error.message);
      return NextResponse.json(
        { error: configured ? error.message : "Yapay zekâ ile arama şu anda kullanılamıyor. Klasik filtreleri kullanarak arama yapabilirsiniz." },
        { status: 503 },
      );
    }
    console.error("AI parse failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Yapay zekâ ile arama şu anda kullanılamıyor. Klasik filtreleri kullanarak arama yapabilirsiniz." },
      { status: 500 },
    );
  }
}
