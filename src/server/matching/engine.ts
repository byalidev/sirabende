import "server-only";

import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../auth/auth";
import { getActiveRequests, getRequestsByOwner, type RequestView } from "../requests/repository";
import { rankOffers, rankRequests, requestToMatchProfile, type MatchProfile } from "./scoring";
import type { OfferMatchInput } from "./types";

async function productTermsFor(query?: string) {
  if (!query) return [];
  const tokens = query.toLocaleLowerCase("tr-TR").split(/\s+/).filter((token) => token.length > 2);
  if (!tokens.length) return [];
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: tokens.flatMap((token) => [
        { name: { contains: token, mode: "insensitive" as const } },
        { brand: { contains: token, mode: "insensitive" as const } },
        { model: { contains: token, mode: "insensitive" as const } },
        { slug: { contains: token, mode: "insensitive" as const } },
      ]),
    },
    select: { name: true, brand: true, model: true, slug: true },
    take: 8,
  });
  return products.flatMap((product) => [product.name, product.brand, product.model, product.slug].filter((value): value is string => Boolean(value)));
}

export async function rankOffersForRequest(request: RequestView) {
  const offers = await prisma.offer.findMany({
    where: { requestId: request.id },
    select: {
      id: true,
      requestId: true,
      sellerId: true,
      price: true,
      currency: true,
      description: true,
      deliveryInfo: true,
      status: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
      seller: { select: { city: true, district: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const productTerms = await productTermsFor(request.title);
  const ranked = rankOffers(requestToMatchProfile(request), offers.map((offer): OfferMatchInput => ({
    id: offer.id,
    price: offer.price.toString(),
    currency: offer.currency,
    description: offer.description,
    deliveryInfo: offer.deliveryInfo,
    status: offer.status,
    condition: offer.condition,
    sellerCity: offer.seller.city,
    sellerDistrict: offer.seller.district,
    createdAt: offer.createdAt.toISOString(),
  })), productTerms);

  const byId = new Map(offers.map((offer) => [offer.id, offer]));
  return ranked.flatMap((item) => {
    const offer = byId.get(item.id);
    if (!offer) return [];
    return [{
      id: offer.id,
      requestId: offer.requestId,
      sellerId: offer.sellerId,
      price: offer.price.toString(),
      currency: offer.currency,
      description: offer.description,
      deliveryInfo: offer.deliveryInfo,
      status: offer.status,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
      matchScore: item.score,
      matchReasons: item.reasons,
    }];
  });
}

export async function getRecommendedRequestsForSession() {
  const user = await getCurrentUser();
  if (!user) return [];
  const owned = await getRequestsByOwner(user.id, "ACTIVE");
  const source = owned[0];
  if (!source) return [];
  const profile: MatchProfile = requestToMatchProfile(source);
  const result = await getActiveRequests({
    category: source.category?.slug,
    city: source.city,
    sort: "newest",
    page: 1,
  });
  const productTerms = await productTermsFor(source.title);
  return rankRequests(profile, result.requests, productTerms)
    .filter((request) => request.id !== source.id)
    .slice(0, 3);
}
