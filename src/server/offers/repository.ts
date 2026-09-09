import "server-only";

import { Prisma, type OfferStatus, type RequestStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { OfferDomainError, type ValidatedOfferInput } from "./validation";

const offerSelect = {
  id: true,
  requestId: true,
  sellerId: true,
  price: true,
  currency: true,
  description: true,
  deliveryInfo: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OfferSelect;

type OfferRecord = Prisma.OfferGetPayload<{ select: typeof offerSelect }>;

export type OfferView = {
  id: string;
  requestId: string;
  sellerId: string;
  price: string;
  currency: string;
  description: string | null;
  deliveryInfo: string | null;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
};

function toOfferView(offer: OfferRecord): OfferView {
  return {
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
  };
}

export async function getOffersByRequestId(requestId: string) {
  const offers = await prisma.offer.findMany({
    where: { requestId },
    select: offerSelect,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return offers.map(toOfferView);
}

export type OwnedOfferView = OfferView & {
  requestTitle: string;
};

export async function getOffersBySeller(sellerId: string, status?: OfferStatus) {
  const offers = await prisma.offer.findMany({
    where: { sellerId, ...(status ? { status } : {}) },
    select: {
      ...offerSelect,
      request: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return offers.map((offer): OwnedOfferView => ({
    ...toOfferView(offer),
    requestTitle: offer.request.title,
  }));
}

export async function createOffer(requestId: string, sellerId: string, input: ValidatedOfferInput) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: { status: true, expiresAt: true },
  });

  if (!request) throw new OfferDomainError("Talep bulunamadı.");
  if (request.status !== "ACTIVE") throw new OfferDomainError("Bu talep artık teklif kabul etmiyor.");
  if (request.expiresAt && request.expiresAt <= new Date()) throw new OfferDomainError("Bu talebin süresi dolmuş.");

  const existingOffer = await prisma.offer.findFirst({
    where: { requestId, sellerId },
    select: { id: true },
  });

  if (existingOffer) throw new OfferDomainError("Bu talebe zaten teklif verdiniz.");

  const offer = await prisma.offer.create({
    data: {
      requestId,
      sellerId,
      price: input.price,
      currency: "TRY",
      description: input.description,
      deliveryInfo: input.deliveryInfo,
      status: "PENDING",
    },
    select: offerSelect,
  });

  return toOfferView(offer);
}

export type OfferRequestState = {
  status: RequestStatus;
  expiresAt: string | null;
};
