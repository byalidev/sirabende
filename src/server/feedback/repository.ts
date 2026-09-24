import "server-only";

import { prisma } from "../../lib/prisma";
import { checkFeedbackCooldown } from "./rate-limit";

const pageSize = 20;

export async function createPageFeedback(values: { message: string; pageUrl: string; userId: string | null }) {
  const message = values.message.trim();
  if (!message) throw new Error("FEEDBACK_MESSAGE_REQUIRED");

  if (values.userId) {
    const recentFeedback = await prisma.pageFeedback.findMany({
      where: { userId: values.userId },
      orderBy: { createdAt: "desc" },
      take: 1,
      select: { createdAt: true },
    });

    checkFeedbackCooldown(recentFeedback);
  }

  return prisma.pageFeedback.create({
    data: { message, pageUrl: values.pageUrl.slice(0, 500), userId: values.userId },
    select: { id: true },
  });
}

export async function getAdminPageFeedback(page = 1) {
  const [rows, total] = await Promise.all([
    prisma.pageFeedback.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, message: true, pageUrl: true, createdAt: true, user: { select: { username: true } } },
    }),
    prisma.pageFeedback.count(),
  ]);
  return { rows, total, page, pageSize };
}
