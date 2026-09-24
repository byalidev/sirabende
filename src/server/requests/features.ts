import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { RequestValidationError } from "./validation";

export const requestFeatures = ["featured", "pinned", "urgent"] as const;
export type RequestFeature = typeof requestFeatures[number];

const durationsByFeature: Record<RequestFeature, readonly number[]> = {
  featured: [24, 72, 168],
  pinned: [24, 72, 168],
  urgent: [24, 72],
};

const ownerDurationsByFeature: Record<RequestFeature, readonly number[]> = {
  featured: [24],
  pinned: [24],
  urgent: [24],
};

const weeklyOwnerFeatureLimit = 2;

const featureFields: Record<RequestFeature, "featuredUntil" | "pinnedUntil" | "urgentUntil"> = {
  featured: "featuredUntil",
  pinned: "pinnedUntil",
  urgent: "urgentUntil",
};

export function isRequestFeature(value: unknown): value is RequestFeature {
  return typeof value === "string" && requestFeatures.includes(value as RequestFeature);
}

export function getRequestFeatureDurations(feature: RequestFeature) {
  return durationsByFeature[feature];
}

export function getRequestFeatureState(until: Date | null, now = new Date()) {
  return { active: Boolean(until && until > now), until };
}

export async function clearExpiredRequestFeatures(now = new Date()) {
  await Promise.all([
    prisma.request.updateMany({ where: { featuredUntil: { lte: now } }, data: { featuredUntil: null } }),
    prisma.request.updateMany({ where: { pinnedUntil: { lte: now } }, data: { pinnedUntil: null } }),
    prisma.request.updateMany({ where: { urgentUntil: { lte: now } }, data: { urgentUntil: null } }),
  ]);
}

export async function updateRequestFeatureByOwner(requestId: string, userId: string, feature: RequestFeature, durationHours: number | null) {
  if (durationHours !== null && !ownerDurationsByFeature[feature].includes(durationHours)) {
    throw new RequestValidationError("Bu özellik için geçersiz süre seçildi.");
  }

  const now = new Date();
  const visibilityUntil = durationHours === null ? null : new Date(now.getTime() + durationHours * 60 * 60 * 1000);
  const field = featureFields[feature];
  const data: Prisma.RequestUpdateManyMutationInput = { [field]: visibilityUntil };
  if (durationHours === null) {
    const result = await prisma.request.updateMany({
      where: { id: requestId, userId, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      data,
    });
    if (!result.count) throw new RequestValidationError("Talep bulunamadı, aktif değil veya işlem yetkiniz yok.");
    return { feature, until: visibilityUntil };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const result = await transaction.request.updateMany({
        where: { id: requestId, userId, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        data,
      });
      if (!result.count) throw new RequestValidationError("Talep bulunamadı, aktif değil veya işlem yetkiniz yok.");

      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const usageCount = await transaction.requestFeatureUsage.count({ where: { userId, createdAt: { gte: weekStart } } });
      if (usageCount >= weeklyOwnerFeatureLimit) throw new RequestValidationError("Haftalık 2 görünürlük kullanım hakkınız doldu.");

      await transaction.requestFeatureUsage.create({ data: { userId, requestId, feature, durationHours } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof RequestValidationError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      throw new RequestValidationError("Görünürlük hakkınız başka bir işlemde kullanıldı. Lütfen tekrar deneyin.");
    }
    throw error;
  }
  return { feature, until: visibilityUntil };
}

export async function updateRequestFeatureByAdmin(requestId: string, feature: RequestFeature, durationHours: number | null) {
  if (durationHours !== null && !durationsByFeature[feature].includes(durationHours)) {
    throw new RequestValidationError("Bu özellik için geçersiz süre seçildi.");
  }

  const field = featureFields[feature];
  return prisma.request.update({
    where: { id: requestId },
    data: { [field]: durationHours === null ? null : new Date(Date.now() + durationHours * 60 * 60 * 1000) },
    select: { id: true, featuredUntil: true, pinnedUntil: true, urgentUntil: true, updatedAt: true },
  });
}