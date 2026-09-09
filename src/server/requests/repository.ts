import "server-only";

import { Prisma, type RequestCondition, type RequestStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { locations } from "../../config/locations";
import { RequestValidationError, type ValidatedRequestInput } from "./validation";

const requestSelect = {
  id: true,
  title: true,
  description: true,
  minBudget: true,
  maxBudget: true,
  currency: true,
  city: true,
  district: true,
  condition: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { offers: true } },
} satisfies Prisma.RequestSelect;

type RequestRecord = Prisma.RequestGetPayload<{ select: typeof requestSelect }>;

export type RequestView = {
  id: string;
  title: string;
  description: string | null;
  minBudget: string | null;
  maxBudget: string | null;
  currency: string;
  city: string;
  district: string | null;
  condition: RequestCondition;
  status: RequestStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  offerCount: number;
};

function toRequestView(request: RequestRecord): RequestView {
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    minBudget: request.minBudget?.toString() ?? null,
    maxBudget: request.maxBudget?.toString() ?? null,
    currency: request.currency,
    city: request.city,
    district: request.district,
    condition: request.condition,
    status: request.status,
    expiresAt: request.expiresAt?.toISOString() ?? null,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    category: request.category,
    offerCount: request._count.offers,
  };
}

export type RequestSort = "newest" | "oldest" | "budget_asc" | "budget_desc" | "expiring";
export type RequestDateFilter = "today" | "3d" | "7d" | "30d";

export type RequestFilters = {
  q?: string;
  category?: string;
  city?: string;
  district?: string;
  minBudget?: number;
  maxBudget?: number;
  condition?: RequestCondition;
  date?: RequestDateFilter;
  sort?: RequestSort;
  page?: number;
};

export const PUBLIC_REQUEST_PAGE_SIZE = 20;

export type PaginatedRequestView = {
  requests: RequestView[];
  total: number;
  page: number;
  pageSize: number;
};

export async function createRequest(input: ValidatedRequestInput & { categoryId: string }, userId: string) {
  const request = await prisma.request.create({
    data: {
      userId,
      categoryId: input.categoryId,
      title: input.title,
      description: input.description,
      minBudget: input.minBudget,
      maxBudget: input.maxBudget,
      currency: "TRY",
      city: input.city,
      district: input.district,
      condition: input.condition,
      status: "ACTIVE",
      expiresAt: input.expiresAt,
    },
    select: { id: true },
  });

  return request;
}

export async function getActiveCategoryId(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, isActive: true },
  });

  if (!category?.isActive) {
    throw new RequestValidationError("Geçersiz veya pasif kategori.");
  }

  return category.id;
}

function getRequestOrder(sort: RequestSort): Prisma.RequestOrderByWithRelationInput | Prisma.RequestOrderByWithRelationInput[] {
  if (sort === "oldest") return { createdAt: "asc" };
  if (sort === "budget_asc") return [{ minBudget: "asc" }, { createdAt: "desc" }];
  if (sort === "budget_desc") return [{ maxBudget: "desc" }, { createdAt: "desc" }];
  if (sort === "expiring") return [{ expiresAt: "asc" }, { createdAt: "desc" }];
  return { createdAt: "desc" };
}

export async function normalizeRequestFilters(query: Record<string, string | string[] | undefined>): Promise<RequestFilters> {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const q = first(query.q)?.trim().slice(0, 120) || undefined;
  const categoryValue = first(query.category)?.trim();
  const cityValue = first(query.city)?.trim();
  const districtValue = first(query.district)?.trim();
  const category = categoryValue ? (await prisma.category.findFirst({ where: { slug: categoryValue, isActive: true }, select: { slug: true } }))?.slug : undefined;
  const city = cityValue && Object.prototype.hasOwnProperty.call(locations, cityValue) ? cityValue : undefined;
  const district = city && districtValue && locations[city].includes(districtValue) ? districtValue : undefined;
  const toBudget = (value: string | undefined) => {
    if (!value || !/^\d+(?:\.\d{1,2})?$/.test(value)) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1000000000 ? parsed : undefined;
  };
  const minBudget = toBudget(first(query.minBudget));
  const maxBudget = toBudget(first(query.maxBudget));
  const conditionValue = first(query.condition);
  const condition = Object.values({ NEW: "NEW", USED: "USED", REFURBISHED: "REFURBISHED", UNKNOWN: "UNKNOWN" }).includes(conditionValue as string) ? conditionValue as RequestCondition : undefined;
  const dateValue = first(query.date);
  const date = ["today", "3d", "7d", "30d"].includes(dateValue ?? "") ? dateValue as RequestDateFilter : undefined;
  const sortValue = first(query.sort);
  const sort = ["newest", "oldest", "budget_asc", "budget_desc", "expiring"].includes(sortValue ?? "") ? sortValue as RequestSort : "newest";
  const pageValue = Number(first(query.page));
  const hasInvalidBudgetRange = minBudget !== undefined && maxBudget !== undefined && minBudget > maxBudget;
  return { q, category, city, district, minBudget: hasInvalidBudgetRange ? undefined : minBudget, maxBudget: hasInvalidBudgetRange ? undefined : maxBudget, condition, date, sort, page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1 };
}

export async function getActiveRequests(filters: RequestFilters = {}): Promise<PaginatedRequestView> {
  const where: Prisma.RequestWhereInput = {
    status: "ACTIVE",
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };

  if (filters.q) where.AND = [{ OR: [{ title: { contains: filters.q, mode: "insensitive" } }, { description: { contains: filters.q, mode: "insensitive" } }] }];
  if (filters.category) where.category = { slug: filters.category, isActive: true };
  if (filters.city) where.city = filters.city;
  if (filters.district) where.district = filters.district;
  if (filters.condition) where.condition = filters.condition;
  if (filters.minBudget !== undefined) where.AND = [...(Array.isArray(where.AND) ? where.AND : []), { OR: [{ maxBudget: null }, { maxBudget: { gte: filters.minBudget } }] }];
  if (filters.maxBudget !== undefined) where.AND = [...(Array.isArray(where.AND) ? where.AND : []), { OR: [{ minBudget: null }, { minBudget: { lte: filters.maxBudget } }] }];
  if (filters.date) {
    const days = filters.date === "today" ? 1 : Number(filters.date.replace("d", ""));
    where.createdAt = { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
  }

  const page = filters.page ?? 1;
  const [requests, total] = await Promise.all([
    prisma.request.findMany({
    where,
    select: requestSelect,
    orderBy: getRequestOrder(filters.sort ?? "newest"),
    skip: (page - 1) * PUBLIC_REQUEST_PAGE_SIZE,
    take: PUBLIC_REQUEST_PAGE_SIZE,
    }),
    prisma.request.count({ where }),
  ]);

  return { requests: requests.map(toRequestView), total, page, pageSize: PUBLIC_REQUEST_PAGE_SIZE };
}

export type OwnerRequestFilter = "ALL" | "ACTIVE" | "EXPIRED" | "CLOSED";

export async function getRequestsByOwner(userId: string, filter: OwnerRequestFilter = "ALL") {
  const where: Prisma.RequestWhereInput = { userId };
  const now = new Date();

  if (filter === "ACTIVE") {
    where.status = "ACTIVE";
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }];
  }
  if (filter === "EXPIRED") {
    where.OR = [{ status: "EXPIRED" }, { status: "ACTIVE", expiresAt: { lt: now } }];
  }
  if (filter === "CLOSED") {
    where.status = { in: ["CLOSED", "COMPLETED", "CANCELLED"] };
  }

  const requests = await prisma.request.findMany({
    where,
    select: requestSelect,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return requests.map(toRequestView);
}

export async function getActiveRequestsByIds(requestIds: string[]) {
  if (!requestIds.length) return [];
  const requests = await prisma.request.findMany({
    where: { id: { in: requestIds }, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: requestSelect,
    orderBy: { createdAt: "desc" },
  });
  return requests.map(toRequestView);
}

export async function getRequestById(id: string) {
  const request = await prisma.request.findUnique({
    where: { id },
    select: requestSelect,
  });

  return request ? toRequestView(request) : null;
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });
}
