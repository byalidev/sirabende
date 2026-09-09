import { NextResponse } from "next/server";
import { getRequestActor } from "../../../../../server/requests/actor";
import { blockUser, BlockError, unblockUser } from "../../../../../server/blocks/repository";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function actorAndId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return null;
  return { id, actor: await getRequestActor() };
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const values = await actorAndId(params);
    if (!values) return NextResponse.json({ error: "Geçersiz kullanıcı bağlantısı." }, { status: 400 });
    await blockUser(values.actor.id, values.id);
    return NextResponse.json({ blocked: true }, { status: 201 });
  } catch (error) {
    if (error instanceof BlockError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("User block failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Kullanıcı engellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const values = await actorAndId(params);
    if (!values) return NextResponse.json({ error: "Geçersiz kullanıcı bağlantısı." }, { status: 400 });
    await unblockUser(values.actor.id, values.id);
    return NextResponse.json({ blocked: false });
  } catch (error) {
    if (error instanceof BlockError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("User unblock failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Kullanıcı engeli kaldırılırken bir hata oluştu." }, { status: 500 });
  }
}
