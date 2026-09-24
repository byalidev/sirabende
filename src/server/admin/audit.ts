import "server-only";

import { AdminActionType, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { isValidUsername, USERNAME_VALIDATION_MESSAGE } from "../../lib/auth-validation";
import { hashPassword, requireSuperAdmin } from "../auth/auth";

export const SUPER_ADMIN_PAGE_SIZE = 25;

export async function clearUserBansAsSuperAdmin(userId: string) {
  const admin = await requireSuperAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!user) throw new Error("USER_NOT_FOUND");
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { isActive: true, bannedUntil: null, postingBannedUntil: null, offeringBannedUntil: null } }),
    prisma.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_UNBAN_USER", targetUserId: userId, reason: "Super Admin tarafından yasaklar kaldırıldı" } }),
  ]);
}

export async function revokeSanctionAsSuperAdmin(strikeId: string) {
  const admin = await requireSuperAdmin();
  const strike = await prisma.userStrike.findUnique({ where: { id: strikeId }, select: { userId: true, level: true, status: true, user: { select: { username: true } } } });
  if (!strike) throw new Error("STRIKE_NOT_FOUND");
  if (strike.status === "REVOKED") return;
  const counterField = strike.level === "LOW" ? "lowStrikeCount" : strike.level === "MEDIUM" ? "mediumStrikeCount" : "highStrikeCount";
  await prisma.$transaction([
    prisma.userStrike.update({ where: { id: strikeId }, data: { status: "REVOKED", revokedAt: new Date() } }),
    prisma.user.update({ where: { id: strike.userId }, data: { [counterField]: { decrement: 1 } } }),
    prisma.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_REVOKE_SANCTION", targetUserId: strike.userId, reason: "Super Admin tarafından yaptırım geri çekildi", metadata: { strikeId, level: strike.level } } }),
  ]);
}

export async function createManagedAdmin(input: { username: string; email: string; password: string }) {
  const owner = await requireSuperAdmin();
  const normalizedUsername = input.username.trim();
  if (!isValidUsername(normalizedUsername) || input.password.length < 8) throw new Error("INVALID_ADMIN");
  const existing = await prisma.user.findFirst({ where: { OR: [{ username: normalizedUsername }, { email: input.email }] }, select: { id: true } });
  if (existing) throw new Error("ADMIN_EXISTS");
  const role = await prisma.role.upsert({ where: { name: "ADMIN" }, update: {}, create: { name: "ADMIN", description: "Yönetici" } });
  const admin = await prisma.user.create({ data: { username: normalizedUsername, email: input.email, passwordHash: await hashPassword(input.password), userRoles: { create: { roleId: role.id } } }, select: { id: true, username: true } });
  await prisma.adminActionLog.create({ data: { adminId: owner.id, action: "ADMIN_CREATED", targetUserId: admin.id, reason: "Super Admin tarafından oluşturuldu" } });
  return admin;
}

export async function updateManagedAdmin(id: string, input: { isActive?: boolean; role?: "USER" | "ADMIN" }) {
  const owner = await requireSuperAdmin();
  if (owner.id === id) throw new Error("SELF_ADMIN");
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, isActive: true, userRoles: { select: { role: { select: { name: true, id: true } } } } } });
  if (!target || !target.userRoles.some(({ role }) => role.name === "ADMIN")) throw new Error("ADMIN_NOT_FOUND");
  const roleName = input.role ?? "ADMIN";
  const role = await prisma.role.upsert({ where: { name: roleName }, update: {}, create: { name: roleName, description: roleName === "ADMIN" ? "Yönetici" : "Standart kullanıcı" } });
  await prisma.$transaction(async (transaction) => {
    if (input.isActive !== undefined) await transaction.user.update({ where: { id }, data: { isActive: input.isActive } });
    await transaction.userRole.deleteMany({ where: { userId: id } });
    await transaction.userRole.create({ data: { userId: id, roleId: role.id } });
    await transaction.adminActionLog.create({ data: { adminId: owner.id, action: input.isActive === undefined ? "ADMIN_ROLE_CHANGED" : "ADMIN_STATUS_CHANGED", targetUserId: id, reason: input.isActive === undefined ? `Rol: ${roleName}` : input.isActive ? "Aktifleştirildi" : "Pasifleştirildi" } });
  });
}

export async function deleteManagedAdmin(id: string) {
  const owner = await requireSuperAdmin();
  if (owner.id === id) throw new Error("SELF_ADMIN");
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, isActive: true, userRoles: { select: { role: { select: { name: true, id: true } } } } } });
  if (!target || !target.userRoles.some(({ role }) => role.name === "ADMIN")) throw new Error("ADMIN_NOT_FOUND");
  const userRole = await prisma.role.upsert({ where: { name: "USER" }, update: {}, create: { name: "USER", description: "Standart kullanıcı" } });
  await prisma.$transaction(async (transaction) => {
    await transaction.user.update({ where: { id }, data: { isActive: false } });
    await transaction.userRole.deleteMany({ where: { userId: id } });
    await transaction.userRole.create({ data: { userId: id, roleId: userRole.id } });
    await transaction.adminActionLog.create({ data: { adminId: owner.id, action: "ADMIN_ROLE_CHANGED", targetUserId: id, reason: "Admin hesabı silindi; kullanıcı rolü geri alındı." } });
  });
  return target;
}

export async function getSuperAdminData(filters: { admin?: string; action?: string; from?: string; to?: string; user?: string; request?: string; offer?: string; page?: number }) {
  await requireSuperAdmin();
  const page = Math.max(1, filters.page ?? 1);
  const where: Prisma.AdminActionLogWhereInput = {};
  if (filters.admin) where.adminId = filters.admin;
  if (filters.action && Object.values(AdminActionType).includes(filters.action as AdminActionType)) where.action = filters.action as AdminActionType;
  if (filters.user) where.targetUserId = filters.user;
  if (filters.request) where.targetRequestId = filters.request;
  if (filters.offer) where.targetOfferId = filters.offer;
  if (filters.from || filters.to) where.createdAt = { ...(filters.from ? { gte: new Date(filters.from) } : {}), ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59.999`) } : {}) };

  const [logs, total, admins, moderationCount, strikeCount, reportCount, messageCount] = await Promise.all([
    prisma.adminActionLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * SUPER_ADMIN_PAGE_SIZE, take: SUPER_ADMIN_PAGE_SIZE, select: { id: true, action: true, targetUserId: true, targetRequestId: true, targetOfferId: true, targetReportId: true, targetMessageId: true, reason: true, metadata: true, createdAt: true, admin: { select: { username: true } } } }),
    prisma.adminActionLog.count({ where }),
    prisma.user.findMany({ where: { userRoles: { some: { role: { name: { in: ["ADMIN", "SUPER_ADMIN"] } } } } }, orderBy: { createdAt: "asc" }, select: { id: true, username: true, isActive: true, createdAt: true, userRoles: { select: { role: { select: { name: true } } } }, sessions: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } } } }),
    prisma.moderationAction.count(),
    prisma.userStrike.count(),
    prisma.report.count({ where: { status: { not: "PENDING" } } }),
    prisma.messageModerationFlag.count({ where: { reviewedById: { not: null } } }),
  ]);
  const targetUserIds = logs.map((log) => log.targetUserId).filter((id): id is string => Boolean(id));
  const targetUsers = await prisma.user.findMany({ where: { id: { in: targetUserIds } }, select: { id: true, username: true } });
  const usernames = new Map(targetUsers.map((user) => [user.id, user.username]));
  return { logs: logs.map((log) => ({ ...log, targetUsername: log.targetUserId ? usernames.get(log.targetUserId) ?? null : null })), total, page, pageSize: SUPER_ADMIN_PAGE_SIZE, admins, stats: { moderationCount, strikeCount, reportCount, messageCount }, actions: Object.values(AdminActionType) };
}

export async function getSuperAdminProfile(id: string) {
  await requireSuperAdmin();
  const admin = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, email: true, isActive: true, createdAt: true, sessions: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } }, userRoles: { select: { role: { select: { name: true } } } } } });
  if (!admin) return null;
  const [sanctions, bans, deletedRequests, deletedOffers, reports, messages] = await Promise.all([
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_APPLY_SANCTION" } }),
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_BAN_USER" } }),
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_DELETE_REQUEST" } }),
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_DELETE_OFFER" } }),
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_REVIEW_REPORT" } }),
    prisma.adminActionLog.count({ where: { adminId: id, action: "ADMIN_REVIEW_MESSAGE" } }),
  ]);
  return { admin, stats: { sanctions, bans, deletedRequests, deletedOffers, reports, messages } };
}
