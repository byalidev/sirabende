import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../../server/requests/actor";
import { addFavorite, FavoriteError, removeFavorite } from "../../../../../server/favorites/repository";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function actorAndId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return null;
  return { id, actor: await getRequestActor() };
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const values = await actorAndId(params);
    if (!values) return NextResponse.json({ error: "Geçersiz talep bağlantısı." }, { status: 400 });
    await addFavorite(values.actor.id, values.id);
    return NextResponse.json({ favorited: true }, { status: 201 });
  } catch (error) {
    if (error instanceof FavoriteError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Favorite creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Talep favorilenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const values = await actorAndId(params);
    if (!values) return NextResponse.json({ error: "Geçersiz talep bağlantısı." }, { status: 400 });
    await removeFavorite(values.actor.id, values.id);
    return NextResponse.json({ favorited: false });
  } catch (error) {
    if (error instanceof FavoriteError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Favorite removal failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Favori kaldırılırken bir hata oluştu." }, { status: 500 });
  }
}
