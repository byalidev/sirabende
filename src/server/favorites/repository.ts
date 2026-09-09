import "server-only";

import { prisma } from "../../lib/prisma";

export class FavoriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FavoriteError";
  }
}

export async function getFavoriteRequestIds(userId: string, requestIds: string[]) {
  if (!requestIds.length) return new Set<string>();
  const favorites = await prisma.favoriteRequest.findMany({
    where: { userId, requestId: { in: requestIds } },
    select: { requestId: true },
  });
  return new Set(favorites.map((favorite) => favorite.requestId));
}

export async function isRequestFavorited(userId: string, requestId: string) {
  return Boolean(await prisma.favoriteRequest.findUnique({ where: { userId_requestId: { userId, requestId } }, select: { requestId: true } }));
}

export async function addFavorite(userId: string, requestId: string) {
  const request = await prisma.request.findUnique({ where: { id: requestId }, select: { id: true } });
  if (!request) throw new FavoriteError("Talep bulunamadı.");
  const existing = await prisma.favoriteRequest.findUnique({ where: { userId_requestId: { userId, requestId } }, select: { requestId: true } });
  if (existing) throw new FavoriteError("Bu talep zaten favorilerinde.");
  try {
    await prisma.favoriteRequest.create({ data: { userId, requestId } });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) throw new FavoriteError("Bu talep zaten favorilerinde.");
    throw error;
  }
}

export async function removeFavorite(userId: string, requestId: string) {
  const result = await prisma.favoriteRequest.deleteMany({ where: { userId, requestId } });
  if (!result.count) throw new FavoriteError("Bu talep favorilerinde değil.");
}

export async function getFavoriteRequests(userId: string) {
  return prisma.favoriteRequest.findMany({
    where: { userId, request: { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } },
    select: { createdAt: true, requestId: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
