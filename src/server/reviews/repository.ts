import "server-only";

import { prisma } from "../../lib/prisma";
import { isPrismaUniqueError } from "./validation";

export class ReviewDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewDomainError";
  }
}

export async function createReview(offerId: string, reviewerId: string, rating: number, comment: string | null) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, sellerId: true, status: true, requestId: true, request: { select: { userId: true } } },
  });
  if (!offer) throw new ReviewDomainError("Teklif bulunamadı.");
  if (offer.status !== "ACCEPTED") throw new ReviewDomainError("Yalnızca kabul edilmiş teklifler değerlendirilebilir.");
  if (reviewerId !== offer.sellerId && reviewerId !== offer.request.userId) throw new ReviewDomainError("Bu işlemde taraf değilsiniz.");
  const reviewedUserId = reviewerId === offer.sellerId ? offer.request.userId : offer.sellerId;
  if (reviewerId === reviewedUserId) throw new ReviewDomainError("Kendinizi değerlendiremezsiniz.");

  const existing = await prisma.review.findFirst({ where: { reviewerId, offerId }, select: { id: true } });
  if (existing) throw new ReviewDomainError("Bu işlem zaten değerlendirildi.");

  try {
    return await prisma.review.create({
      data: { reviewerId, reviewedUserId, offerId, requestId: offer.requestId, rating, comment },
      select: { id: true, rating: true, comment: true, createdAt: true },
    });
  } catch (error) {
    if (isPrismaUniqueError(error)) throw new ReviewDomainError("Bu işlem zaten değerlendirildi.");
    throw error;
  }
}

export async function getUserReviewSummary(userId: string) {
  const summary = await prisma.review.aggregate({ where: { reviewedUserId: userId }, _avg: { rating: true }, _count: { _all: true } });
  return { averageRating: summary._avg.rating ?? 0, reviewCount: summary._count._all };
}

export async function getReviewsByUser(userId: string) {
  return prisma.review.findMany({ where: { reviewedUserId: userId }, select: { id: true, rating: true, comment: true, createdAt: true, request: { select: { title: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
}
