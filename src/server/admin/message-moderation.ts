import "server-only";

import { MessageModerationReviewStatus, MessageModerationType, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../auth/auth";

export type MessageModerationFilter = "ALL" | "NORMAL" | "PENDING" | "REPORTED" | MessageModerationType;

const moderationFlagSelect = {
  id: true,
  type: true,
  severity: true,
  matchedRule: true,
  maskedText: true,
  reviewStatus: true,
  reviewedAt: true,
  adminNote: true,
  createdAt: true,
  reviewedBy: { select: { username: true } },
} satisfies Prisma.MessageModerationFlagSelect;

function flagView(flag: Prisma.MessageModerationFlagGetPayload<{ select: typeof moderationFlagSelect }>) {
  return { ...flag, reviewedAt: flag.reviewedAt?.toISOString() ?? null, createdAt: flag.createdAt.toISOString(), reviewedBy: flag.reviewedBy?.username ?? null };
}

export async function getAdminMessageModeration(filter: MessageModerationFilter = "ALL", page = 1) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const pageSize = 30;
  const flagWhere: Prisma.MessageWhereInput | undefined = filter === "PENDING" ? { moderationFlags: { some: { reviewStatus: { in: ["PENDING", "IN_REVIEW"] } } } } : filter === "REPORTED" ? { reports: { some: {} } } : filter !== "ALL" && filter !== "NORMAL" ? { moderationFlags: { some: { type: filter } } } : undefined;
  const conversationWhere: Prisma.ConversationWhereInput = filter === "NORMAL" ? { messages: { every: { moderationFlags: { none: {} }, reports: { none: {} } } } } : flagWhere ? { messages: { some: flagWhere } } : {};
  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where: conversationWhere,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        updatedAt: true,
        buyer: { select: { username: true } },
        seller: { select: { username: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true, content: true, createdAt: true, moderationFlags: { select: moderationFlagSelect }, reports: { select: { status: true } } } },
      },
    }),
    prisma.conversation.count({ where: conversationWhere }),
  ]);

  return {
    rows: conversations.map((conversation) => {
      const message = conversation.messages[0] ?? null;
      const flags = message?.moderationFlags.map(flagView) ?? [];
      const reported = message?.reports.some((report) => report.status === "PENDING" || report.status === "REVIEWING") ?? false;
      return { id: conversation.id, participants: `${conversation.buyer.username} · ${conversation.seller.username}`, lastMessage: message?.content ?? "Mesaj yok", lastMessageAt: message?.createdAt.toISOString() ?? conversation.updatedAt.toISOString(), flags, reported, reviewStatus: flags.some((flag) => flag.reviewStatus === "PENDING" || flag.reviewStatus === "IN_REVIEW") ? "İnceleme bekliyor" : reported ? "Raporlu" : flags.length ? "İşaretli" : "Normal" };
    }),
    total,
    page,
    pageSize,
  };
}

export async function getAdminConversationModeration(id: string) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      createdAt: true,
      buyer: { select: { id: true, username: true, email: true } },
      seller: { select: { id: true, username: true, email: true } },
      messages: { orderBy: { createdAt: "asc" }, take: 200, select: { id: true, senderId: true, content: true, createdAt: true, sender: { select: { username: true } }, moderationFlags: { select: moderationFlagSelect }, reports: { select: { id: true, reason: true, status: true, createdAt: true, reporter: { select: { username: true } } } } } },
    },
  });
  if (!conversation) return null;
  return { ...conversation, createdAt: conversation.createdAt.toISOString(), messages: conversation.messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString(), moderationFlags: message.moderationFlags.map(flagView), reports: message.reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString() })) })) };
}

export async function reviewMessageModerationFlag(id: string, status: MessageModerationReviewStatus, adminNote: string | null) {
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const flag = await prisma.messageModerationFlag.update({ where: { id }, data: { reviewStatus: status, reviewedAt: new Date(), reviewedById: admin.id, adminNote: adminNote?.trim().slice(0, 2000) || null }, select: { id: true, messageId: true, reviewStatus: true, reviewedAt: true, adminNote: true } });
  await prisma.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_REVIEW_MESSAGE", targetMessageId: flag.messageId, reason: flag.adminNote, metadata: { flagId: flag.id, status: flag.reviewStatus } } });
  return flag;
}
