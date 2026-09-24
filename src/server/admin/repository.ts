import "server-only";

import { Prisma, type AdminActionType, type ModerationType, type OfferStatus, type ReportStatus, type RequestStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../auth/auth";
import { type RequestFeature, updateRequestFeatureByAdmin } from "../requests/features";

const pageSize = 20;

export type AdminStats = {
  users: number;
  activeUsers: number;
  requests: number;
  activeRequests: number;
  offers: number;
  pendingOffers: number;
  conversations: number;
  messages: number;
  reports: number;
  pendingReports: number;
  reviews: number;
  lowStrikes: number;
  mediumStrikes: number;
  highStrikes: number;
  permanentlySuspendedUsers: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const now = new Date();
  const [users, activeUsers, requests, activeRequests, offers, pendingOffers, conversations, messages, reports, pendingReports, reviews, lowStrikes, mediumStrikes, highStrikes, permanentlySuspendedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.request.count(),
    prisma.request.count({ where: { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.offer.count(),
    prisma.offer.count({ where: { status: "PENDING" } }),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.report.count(),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.review.count(),
    prisma.userStrike.count({ where: { level: "LOW", status: "ACTIVE" } }),
    prisma.userStrike.count({ where: { level: "MEDIUM", status: "ACTIVE" } }),
    prisma.userStrike.count({ where: { level: "HIGH", status: "ACTIVE" } }),
    prisma.user.count({ where: { permanentlySuspendedAt: { not: null } } }),
  ]);
  return { users, activeUsers, requests, activeRequests, offers, pendingOffers, conversations, messages, reports, pendingReports, reviews, lowStrikes, mediumStrikes, highStrikes, permanentlySuspendedUsers };
}

export type AdminUserRow = {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  permanentlySuspendedAt: string | null;
  createdAt: string;
  roles: string[];
  requestCount: number;
  offerCount: number;
  reviewCount: number;
};

export async function getAdminUsers(search = "", page = 1) {
  const query = search.trim();
  const where: Prisma.UserWhereInput = query ? { OR: [{ username: { contains: query, mode: "insensitive" } }, { email: { contains: query, mode: "insensitive" } }] } : {};
  const [rows, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, username: true, email: true, isActive: true, permanentlySuspendedAt: true, createdAt: true, userRoles: { select: { role: { select: { name: true } } } }, _count: { select: { requests: true, offers: true, reviewsReceived: true } } } }),
    prisma.user.count({ where }),
  ]);
  return { rows: rows.map((row): AdminUserRow => ({ id: row.id, username: row.username, email: row.email, isActive: row.isActive, permanentlySuspendedAt: row.permanentlySuspendedAt?.toISOString() ?? null, createdAt: row.createdAt.toISOString(), roles: row.userRoles.map((item) => item.role.name), requestCount: row._count.requests, offerCount: row._count.offers, reviewCount: row._count.reviewsReceived })), total, page, pageSize };
}

export type AdminRequestRow = { id: string; title: string; username: string; category: string; city: string; status: RequestStatus; budget: string; createdAt: string; expiresAt: string | null };
export async function getAdminRequests(search = "", status?: RequestStatus, categoryId?: string, page = 1) {
  const query = search.trim();
  const where: Prisma.RequestWhereInput = { ...(status ? { status } : {}), ...(categoryId ? { categoryId } : {}), ...(query ? { OR: [{ title: { contains: query, mode: "insensitive" } }, { city: { contains: query, mode: "insensitive" } }, { user: { username: { contains: query, mode: "insensitive" } } }] } : {}) };
  const [rows, total] = await Promise.all([
    prisma.request.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, title: true, city: true, status: true, minBudget: true, maxBudget: true, createdAt: true, expiresAt: true, user: { select: { username: true } }, category: { select: { name: true } } } }),
    prisma.request.count({ where }),
  ]);
  return { rows: rows.map((row): AdminRequestRow => ({ id: row.id, title: row.title, username: row.user.username, category: row.category?.name ?? "Kategorisiz", city: row.city, status: row.status, budget: row.maxBudget ? `${row.minBudget?.toString() ?? "0"} - ${row.maxBudget.toString()}` : row.minBudget?.toString() ?? "Belirtilmemiş", createdAt: row.createdAt.toISOString(), expiresAt: row.expiresAt?.toISOString() ?? null })), total, page, pageSize };
}

export type AdminOfferRow = { id: string; seller: string; request: string; requestId: string; price: string; status: OfferStatus; deliveryInfo: string | null; createdAt: string };
export async function getAdminOffers(status?: OfferStatus, page = 1) {
  const where: Prisma.OfferWhereInput = status ? { status } : {};
  const [rows, total] = await Promise.all([
    prisma.offer.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, requestId: true, price: true, currency: true, status: true, deliveryInfo: true, createdAt: true, seller: { select: { username: true } }, request: { select: { title: true } } } }),
    prisma.offer.count({ where }),
  ]);
  return { rows: rows.map((row): AdminOfferRow => ({ id: row.id, seller: row.seller.username, request: row.request.title, requestId: row.requestId, price: `${row.price.toString()} ${row.currency}`, status: row.status, deliveryInfo: row.deliveryInfo, createdAt: row.createdAt.toISOString() })), total, page, pageSize };
}

export type AdminReportRow = { id: string; reporter: string; target: string; reason: string; description: string | null; status: ReportStatus; createdAt: string };
export async function getAdminReports(status?: ReportStatus, page = 1) {
  const where: Prisma.ReportWhereInput = status ? { status } : {};
  const [rows, total] = await Promise.all([
    prisma.report.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, reason: true, description: true, status: true, createdAt: true, reporter: { select: { username: true } }, reportedUser: { select: { username: true } }, request: { select: { title: true } }, offer: { select: { id: true } }, message: { select: { id: true } } } }),
    prisma.report.count({ where }),
  ]);
  return { rows: rows.map((row): AdminReportRow => ({ id: row.id, reporter: row.reporter.username, target: row.reportedUser?.username ?? row.request?.title ?? (row.offer ? `Teklif ${row.offer.id.slice(0, 8)}` : row.message ? `Mesaj ${row.message.id.slice(0, 8)}` : "Hedef artık mevcut değil"), reason: row.reason, description: row.description, status: row.status, createdAt: row.createdAt.toISOString() })), total, page, pageSize };
}

export async function getAdminReviews(page = 1) {
  const [rows, total] = await Promise.all([
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, rating: true, comment: true, createdAt: true, reviewer: { select: { username: true } }, reviewedUser: { select: { username: true } }, offer: { select: { id: true } } } }),
    prisma.review.count(),
  ]);
  return { rows, total, page, pageSize };
}

export async function getAdminCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, description: true, isActive: true, createdAt: true, _count: { select: { requests: true, products: true } } } });
}

export async function getAdminUser(id: string) {
  return prisma.user.findUnique({ where: { id }, select: { id: true, username: true, email: true, firstName: true, lastName: true, phone: true, city: true, district: true, isActive: true, isVerified: true, bannedUntil: true, postingBannedUntil: true, offeringBannedUntil: true, lowStrikeCount: true, mediumStrikeCount: true, highStrikeCount: true, permanentlySuspendedAt: true, createdAt: true, userRoles: { select: { role: { select: { name: true } } } }, requests: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, status: true, createdAt: true } }, offers: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, price: true, status: true, createdAt: true, request: { select: { title: true } } } }, reviewsReceived: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, rating: true, comment: true, createdAt: true, reviewer: { select: { username: true } } } }, reportsFiled: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, reason: true, status: true, createdAt: true } }, moderationActions: { orderBy: { createdAt: "desc" }, take: 30, select: { id: true, type: true, reason: true, startsAt: true, endsAt: true, createdAt: true, admin: { select: { username: true } } } }, blocksInitiated: { select: { blocked: { select: { username: true } } } }, blocksReceived: { select: { blocker: { select: { username: true } } } } } });
}

export async function getUserModerationHistory(userId: string) {
  return prisma.moderationAction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30, select: { id: true, type: true, reason: true, startsAt: true, endsAt: true, createdAt: true } });
}

export async function updateAdminUserModeration(id: string, values: { isActive: boolean; bannedUntil: Date | null; postingBannedUntil: Date | null; offeringBannedUntil: Date | null; reason: string }) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  if (admin.id === id) throw new Error("SELF_MODERATION");
  const reason = values.reason.trim();
  if (!reason) throw new Error("MODERATION_REASON_REQUIRED");
  const current = await prisma.user.findUnique({ where: { id }, select: { isActive: true, bannedUntil: true, postingBannedUntil: true, offeringBannedUntil: true } });
  if (!current) throw new Error("USER_NOT_FOUND");
  const actions: Array<{ type: ModerationType; endsAt: Date | null }> = [];
  if (current.bannedUntil?.getTime() !== values.bannedUntil?.getTime() && values.bannedUntil) actions.push({ type: "GENERAL_BAN", endsAt: values.bannedUntil });
  if (current.postingBannedUntil?.getTime() !== values.postingBannedUntil?.getTime() && values.postingBannedUntil) actions.push({ type: "POSTING_BAN", endsAt: values.postingBannedUntil });
  if (current.offeringBannedUntil?.getTime() !== values.offeringBannedUntil?.getTime() && values.offeringBannedUntil) actions.push({ type: "OFFERING_BAN", endsAt: values.offeringBannedUntil });
  if (current.isActive && !values.isActive) actions.push({ type: "ACCOUNT_DEACTIVATION", endsAt: null });
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.update({ where: { id }, data: { isActive: values.isActive, bannedUntil: values.bannedUntil, postingBannedUntil: values.postingBannedUntil, offeringBannedUntil: values.offeringBannedUntil }, select: { id: true, isActive: true, bannedUntil: true, postingBannedUntil: true, offeringBannedUntil: true } });
    if (actions.length) {
      await transaction.moderationAction.createMany({ data: actions.map((action) => ({ userId: id, adminId: admin.id, type: action.type, reason, endsAt: action.endsAt })) });
      await transaction.adminActionLog.createMany({ data: actions.map((action) => ({ adminId: admin.id, action: "ADMIN_BAN_USER" as AdminActionType, targetUserId: id, reason, metadata: { type: action.type, endsAt: action.endsAt?.toISOString() ?? null } })) });
    }
    return user;
  });
}

export async function createAdminCategory(name: string, slug: string) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const duplicate = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] }, select: { id: true } });
  if (duplicate) throw new Error("CATEGORY_DUPLICATE");
  return prisma.category.create({ data: { name, slug }, select: { id: true, name: true, slug: true, description: true, isActive: true, createdAt: true, _count: { select: { requests: true, products: true } } } });
}

export async function updateAdminCategory(id: string, name: string, slug: string) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const duplicate = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }], NOT: { id } }, select: { id: true } });
  if (duplicate) throw new Error("CATEGORY_DUPLICATE");
  return prisma.category.update({ where: { id }, data: { name, slug }, select: { id: true, name: true, slug: true, description: true, isActive: true, createdAt: true, _count: { select: { requests: true, products: true } } } });
}

export async function getAdminRequest(id: string) {
  return prisma.request.findUnique({ where: { id }, select: { id: true, title: true, description: true, city: true, district: true, minBudget: true, maxBudget: true, currency: true, condition: true, status: true, expiresAt: true, featuredUntil: true, pinnedUntil: true, urgentUntil: true, createdAt: true, user: { select: { username: true, email: true } }, category: { select: { name: true } }, offers: { orderBy: { createdAt: "desc" }, take: 20, select: { id: true, price: true, status: true, deliveryInfo: true, seller: { select: { username: true } } } }, _count: { select: { favorites: true, reports: true } } } });
}

export async function updateAdminRequestStatus(id: string, status: RequestStatus) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  return prisma.request.update({ where: { id }, data: { status }, select: { id: true, status: true, updatedAt: true } });
}

export async function updateAdminRequestFeature(id: string, feature: RequestFeature, durationHours: number | null) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  return updateRequestFeatureByAdmin(id, feature, durationHours);
}

export async function deleteAdminRequest(id: string) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const request = await prisma.request.findUnique({ where: { id }, select: { title: true, userId: true } });
  if (!request) throw new Error("REQUEST_NOT_FOUND");
  await prisma.$transaction(async (transaction) => {
    await transaction.request.delete({ where: { id } });
    await transaction.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_DELETE_REQUEST", targetRequestId: id, targetUserId: request.userId, reason: "Admin tarafından silindi", metadata: { title: request.title } } });
  });
}

export async function deleteAdminOffer(id: string) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const offer = await prisma.offer.findUnique({ where: { id }, select: { sellerId: true, requestId: true } });
  if (!offer) throw new Error("OFFER_NOT_FOUND");
  await prisma.$transaction(async (transaction) => {
    await transaction.offer.delete({ where: { id } });
    await transaction.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_DELETE_OFFER", targetOfferId: id, targetUserId: offer.sellerId, reason: "Admin tarafından silindi", metadata: { requestId: offer.requestId } } });
  });
}

export async function deleteAdminCategory(id: string) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const category = await prisma.category.findUnique({ where: { id }, select: { _count: { select: { requests: true, products: true, children: true } } } });
  if (!category) throw new Error("CATEGORY_NOT_FOUND");
  if (category._count.requests || category._count.products || category._count.children) throw new Error("CATEGORY_IN_USE");
  await prisma.category.delete({ where: { id } });
}

export async function getAdminReport(id: string) {
  return prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      reason: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      reporter: { select: { id: true, username: true, email: true } },
      reportedUser: { select: { id: true, username: true, email: true } },
      request: { select: { id: true, title: true, status: true, user: { select: { username: true } } } },
      offer: { select: { id: true, price: true, status: true, seller: { select: { username: true } }, request: { select: { title: true } } } },
      message: { select: { id: true, content: true, sender: { select: { username: true } } } },
    },
  });
}

export async function updateAdminReportStatus(id: string, status: ReportStatus) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const report = await prisma.report.update({ where: { id }, data: { status }, select: { id: true, reason: true, reportedUserId: true, requestId: true, offerId: true, messageId: true, status: true, updatedAt: true } });
  await prisma.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_REVIEW_REPORT", targetReportId: id, targetUserId: report.reportedUserId, targetRequestId: report.requestId, targetOfferId: report.offerId, targetMessageId: report.messageId, reason: report.reason, metadata: { status } } });
  return report;
}

export async function deleteAdminReport(id: string) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const report = await prisma.report.findUnique({ where: { id }, select: { reason: true, reportedUserId: true, requestId: true, offerId: true, messageId: true } });
  if (!report) throw new Error("REPORT_NOT_FOUND");
  await prisma.$transaction(async (transaction) => {
    await transaction.report.delete({ where: { id } });
    await transaction.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_DELETE_REPORT", targetReportId: id, targetUserId: report.reportedUserId, targetRequestId: report.requestId, targetOfferId: report.offerId, targetMessageId: report.messageId, reason: report.reason } });
  });
}

export const ADMIN_PAGE_SIZE = pageSize;
