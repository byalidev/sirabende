import "server-only";

import { type NotificationType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export class NotificationAccessError extends Error {
  constructor(message = "Bu bildirime erişim yetkiniz yok.") {
    super(message);
    this.name = "NotificationAccessError";
  }
}

export type NotificationView = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

function toNotificationView(notification: { id: string; type: NotificationType; title: string; message: string; isRead: boolean; readAt: Date | null; createdAt: Date }): NotificationView {
  return { ...notification, readAt: notification.readAt?.toISOString() ?? null, createdAt: notification.createdAt.toISOString() };
}

export async function getNotificationsForActor(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, type: true, title: true, message: true, isRead: true, readAt: true, createdAt: true },
  });
  return notifications.map(toNotificationView);
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function markNotificationRead(id: string, userId: string) {
  const result = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true, readAt: new Date() },
  });
  if (result.count === 0) throw new NotificationAccessError("Bildirim bulunamadı.");
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}
