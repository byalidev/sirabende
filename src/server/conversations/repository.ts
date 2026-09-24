import "server-only";

import { Prisma, type OfferStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { getPublicStrikeWarning, getTrustScore, type PublicStrikeWarning, type TrustScore } from "../strikes/repository";

export class ConversationAccessError extends Error {
  constructor(message = "Bu konuşmaya erişim yetkiniz yok.") {
    super(message);
    this.name = "ConversationAccessError";
  }
}

export class ConversationDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConversationDomainError";
  }
}

const conversationRelations = {
  buyer: { select: { id: true, username: true, firstName: true, lastName: true } },
  seller: { select: { id: true, username: true, firstName: true, lastName: true } },
  request: { select: { id: true, title: true } },
  offer: { select: { id: true, price: true, currency: true, status: true } },
} satisfies Prisma.ConversationInclude;

type ConversationRecord = Prisma.ConversationGetPayload<{ include: typeof conversationRelations }>;

export type ConversationView = {
  id: string;
  buyerId: string;
  sellerId: string;
  buyer: { id: string; username: string; firstName: string | null; lastName: string | null };
  seller: { id: string; username: string; firstName: string | null; lastName: string | null };
  request: { id: string; title: string } | null;
  offer: { id: string; price: string; currency: string; status: OfferStatus } | null;
  createdAt: string;
  updatedAt: string;
};

export type MessageView = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
};

export type ConversationListItem = ConversationView & {
  lastMessage: MessageView | null;
  unreadCount: number;
};

export type ConversationWithMessages = ConversationView & { messages: MessageView[]; counterpartyWarning: PublicStrikeWarning; counterpartyTrustScore: TrustScore; hasModerationWarning: boolean };

function toConversationView(conversation: ConversationRecord): ConversationView {
  return {
    id: conversation.id,
    buyerId: conversation.buyerId,
    sellerId: conversation.sellerId,
    buyer: conversation.buyer,
    seller: conversation.seller,
    request: conversation.request,
    offer: conversation.offer ? { ...conversation.offer, price: conversation.offer.price.toString() } : null,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

function toMessageView(message: { id: string; conversationId: string; senderId: string; content: string; readAt: Date | null; createdAt: Date }): MessageView {
  return { ...message, readAt: message.readAt?.toISOString() ?? null, createdAt: message.createdAt.toISOString() };
}

export async function getConversationsForActor(actorId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: actorId }, { sellerId: actorId }] },
    include: {
      ...conversationRelations,
      messages: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true, conversationId: true, senderId: true, content: true, readAt: true, createdAt: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const unreadMessages = conversations.length
    ? await prisma.message.findMany({
      where: { conversationId: { in: conversations.map((conversation) => conversation.id) }, senderId: { not: actorId }, readAt: null },
      select: { conversationId: true },
    })
    : [];
  const unreadByConversation = new Map<string, number>();
  for (const message of unreadMessages) unreadByConversation.set(message.conversationId, (unreadByConversation.get(message.conversationId) ?? 0) + 1);

  return conversations.map((conversation) => ({
    ...toConversationView(conversation),
    lastMessage: conversation.messages[0] ? toMessageView(conversation.messages[0]) : null,
    unreadCount: unreadByConversation.get(conversation.id) ?? 0,
  })) satisfies ConversationListItem[];
}

export async function getConversationForActor(id: string, actorId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id, OR: [{ buyerId: actorId }, { sellerId: actorId }] },
    include: {
      ...conversationRelations,
      messages: { orderBy: { createdAt: "asc" }, take: 100, select: { id: true, conversationId: true, senderId: true, content: true, readAt: true, createdAt: true, moderationFlags: { select: { id: true } } } },
    },
  });

  if (!conversation) throw new ConversationAccessError();

  await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: actorId }, readAt: null },
    data: { readAt: new Date() },
  });

  const otherUserId = conversation.buyerId === actorId ? conversation.sellerId : conversation.buyerId;
  const [counterpartyWarning, counterpartyTrustScore] = await Promise.all([getPublicStrikeWarning(otherUserId), getTrustScore(otherUserId)]);
  return {
    ...toConversationView(conversation),
    messages: conversation.messages.map(toMessageView),
    counterpartyWarning,
    counterpartyTrustScore,
    hasModerationWarning: conversation.messages.some((message) => message.moderationFlags.length > 0),
  } satisfies ConversationWithMessages;
}

export async function getOrCreateConversationForOffer(offerId: string, actorId: string) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: {
      id: true,
      sellerId: true,
      status: true,
      request: { select: { id: true, userId: true, status: true, expiresAt: true } },
    },
  });

  if (!offer) throw new ConversationDomainError("Teklif bulunamadı.");
  if (offer.request.status !== "ACTIVE" || (offer.request.expiresAt && offer.request.expiresAt <= new Date())) {
    throw new ConversationDomainError("Bu talep artık iletişime açık değil.");
  }
  if (!["PENDING", "ACCEPTED"].includes(offer.status)) {
    throw new ConversationDomainError("Bu teklif üzerinden iletişim başlatılamaz.");
  }
  if (actorId !== offer.sellerId && actorId !== offer.request.userId) throw new ConversationAccessError();

  const existing = await prisma.conversation.findFirst({
    where: { offerId: offer.id, requestId: offer.request.id, buyerId: offer.request.userId, sellerId: offer.sellerId },
    select: { id: true },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: { offerId: offer.id, requestId: offer.request.id, buyerId: offer.request.userId, sellerId: offer.sellerId },
    select: { id: true },
  });
}

export async function getConversationParticipant(id: string, actorId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id, OR: [{ buyerId: actorId }, { sellerId: actorId }] },
    select: { id: true, buyerId: true, sellerId: true },
  });
  if (!conversation) throw new ConversationAccessError();
  return conversation;
}
