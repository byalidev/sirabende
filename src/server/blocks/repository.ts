import "server-only";

import { prisma } from "../../lib/prisma";

export class BlockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlockError";
  }
}

export async function blockUser(blockerId: string, blockedId: string) {
  if (blockerId === blockedId) throw new BlockError("Kendinizi engelleyemezsiniz.");
  const target = await prisma.user.findUnique({ where: { id: blockedId }, select: { id: true, username: true, firstName: true, lastName: true } });
  if (!target) throw new BlockError("Kullanıcı bulunamadı.");
  const existing = await prisma.userBlock.findUnique({ where: { blockerId_blockedId: { blockerId, blockedId } }, select: { blockerId: true } });
  if (existing) throw new BlockError("Bu kullanıcı zaten engelli.");
  await prisma.userBlock.create({ data: { blockerId, blockedId } });
}

export async function unblockUser(blockerId: string, blockedId: string) {
  const result = await prisma.userBlock.deleteMany({ where: { blockerId, blockedId } });
  if (!result.count) throw new BlockError("Bu kullanıcı engelli değil.");
}

export async function getBlockedUsers(blockerId: string) {
  return prisma.userBlock.findMany({ where: { blockerId }, select: { blockedId: true, createdAt: true, blocked: { select: { username: true, firstName: true, lastName: true } } }, orderBy: { createdAt: "desc" } });
}
