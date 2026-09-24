import "server-only";

import { prisma } from "../../lib/prisma";
import { getConversationParticipant } from "../conversations/repository";
import { detectMessageFlags } from "../moderation/message-engine";

export async function createMessage(conversationId: string, actorId: string, content: string) {
  const conversation = await getConversationParticipant(conversationId, actorId);
  const recipientId = conversation.buyerId === actorId ? conversation.sellerId : conversation.buyerId;
  const moderationFlags = detectMessageFlags(content);

  const result = await prisma.$transaction(async (transaction) => {
    const message = await transaction.message.create({
      data: { conversationId, senderId: actorId, content },
      select: { id: true, conversationId: true, senderId: true, content: true, readAt: true, createdAt: true },
    });

    if (moderationFlags.length) {
      await transaction.messageModerationFlag.createMany({
        data: moderationFlags.map((flag) => ({ ...flag, messageId: message.id })),
      });
    }

    await transaction.notification.create({
      data: {
        userId: recipientId,
        type: "NEW_MESSAGE",
        title: "Yeni mesaj",
        message: "Bir konuşmada yeni mesajın var.",
      },
    });

    return message;
  });

  return { ...result, readAt: result.readAt?.toISOString() ?? null, createdAt: result.createdAt.toISOString() };
}
