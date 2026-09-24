import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const MAX_RESULTS = 8;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    if (q.length < 2) return NextResponse.json({ results: [] });

    const matches = await prisma.product.findMany({
      where: { isActive: true, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true },
      take: 50,
    });

    const lower = q.toLowerCase();
    const results = matches
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(lower) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(lower) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.name.localeCompare(b.name, "tr");
      })
      .slice(0, MAX_RESULTS)
      .map((item) => ({ id: item.id, name: item.name }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Product suggest failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
