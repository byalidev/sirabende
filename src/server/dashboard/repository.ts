import "server-only";

import { prisma } from "../../lib/prisma";
import { getOffersBySeller, type OwnedOfferView } from "../offers/repository";
import { getRequestsByOwner, type RequestView } from "../requests/repository";

export type DashboardData = {
  actor: {
    id: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
  };
  stats: {
    totalRequests: number;
    activeRequests: number;
    totalOffers: number;
    pendingOffers: number;
    totalConversations: number;
    unreadMessages: number;
    unreadNotifications: number;
  };
  recentRequests: RequestView[];
  recentOffers: OwnedOfferView[];
};

export async function getDashboardData(actorId: string): Promise<DashboardData> {
  const now = new Date();
  const [actor, totalRequests, activeRequests, totalOffers, pendingOffers, totalConversations, unreadMessages, unreadNotifications, recentRequests, recentOffers] = await Promise.all([
    prisma.user.findUnique({
      where: { id: actorId },
      select: { id: true, username: true, email: true, firstName: true, lastName: true, isActive: true },
    }),
    prisma.request.count({ where: { userId: actorId } }),
    prisma.request.count({ where: { userId: actorId, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.offer.count({ where: { sellerId: actorId } }),
    prisma.offer.count({ where: { sellerId: actorId, status: "PENDING" } }),
    prisma.conversation.count({ where: { OR: [{ buyerId: actorId }, { sellerId: actorId }] } }),
    prisma.message.count({ where: { senderId: { not: actorId }, readAt: null, conversation: { OR: [{ buyerId: actorId }, { sellerId: actorId }] } } }),
    prisma.notification.count({ where: { userId: actorId, isRead: false } }),
    getRequestsByOwner(actorId, "ALL"),
    getOffersBySeller(actorId),
  ]);

  if (!actor) throw new Error("Dashboard actor was not found.");

  return {
    actor,
    stats: { totalRequests, activeRequests, totalOffers, pendingOffers, totalConversations, unreadMessages, unreadNotifications },
    recentRequests: recentRequests.slice(0, 5),
    recentOffers: recentOffers.slice(0, 5),
  };
}
