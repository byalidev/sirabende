import { NextResponse } from "next/server";
import { deleteManagedAdmin, updateManagedAdmin } from "../../../../../../server/admin/audit";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json() as { isActive?: unknown; role?: unknown };
    if (body.isActive !== undefined && typeof body.isActive !== "boolean") return NextResponse.json({ error: "Durum geçersiz." }, { status: 400 });
    if (body.role !== undefined && body.role !== "USER" && body.role !== "ADMIN") return NextResponse.json({ error: "Rol geçersiz." }, { status: 400 });
    await updateManagedAdmin((await params).id, { isActive: body.isActive as boolean | undefined, role: body.role as "USER" | "ADMIN" | undefined });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "SELF_ADMIN") return NextResponse.json({ error: "Kendi hesabınızı değiştiremezsiniz." }, { status: 400 });
    if (error instanceof Error && error.message === "ADMIN_NOT_FOUND") return NextResponse.json({ error: "Admin bulunamadı." }, { status: 404 });
    return NextResponse.json({ error: "Admin güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await deleteManagedAdmin((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "SELF_ADMIN") return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
    if (error instanceof Error && error.message === "ADMIN_NOT_FOUND") return NextResponse.json({ error: "Admin bulunamadı." }, { status: 404 });
    return NextResponse.json({ error: "Admin hesabı silinemedi." }, { status: 500 });
  }
}