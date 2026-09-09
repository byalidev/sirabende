import assert from "node:assert/strict";
import test from "node:test";
import { MATCH_WEIGHTS, rankOffers, rankRequests, scoreOfferMatchResult, scoreRequestMatch } from "./scoring";
import type { OfferMatchInput } from "./types";
import type { RequestView } from "../requests/repository";

function request(overrides: Partial<RequestView>): RequestView {
  return {
    id: "a",
    title: "PS5 Slim",
    description: "temiz ikinci el",
    minBudget: "15000",
    maxBudget: "20000",
    currency: "TRY",
    city: "İzmir",
    district: "Bornova",
    condition: "USED",
    status: "ACTIVE",
    expiresAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    category: { id: "c1", name: "Oyun Konsolu", slug: "oyun-konsolu" },
    offerCount: 0,
    ...overrides,
  };
}

function offer(overrides: Partial<OfferMatchInput>): OfferMatchInput {
  return {
    id: "o1",
    price: "19500",
    currency: "TRY",
    description: "PS5 Slim kutulu",
    deliveryInfo: "İzmir elden",
    status: "PENDING",
    condition: "USED",
    sellerCity: "İzmir",
    sellerDistrict: "Bornova",
    createdAt: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

const profile = {
  query: "PS5 Slim",
  categorySlug: "oyun-konsolu",
  city: "İzmir",
  district: "Bornova",
  minBudget: 0,
  maxBudget: 20000,
  condition: "USED" as const,
};

test("category city district budget condition and text scores", () => {
  const score = scoreRequestMatch(profile, request({}));
  assert.equal(score, MATCH_WEIGHTS.category + MATCH_WEIGHTS.city + MATCH_WEIGHTS.district + MATCH_WEIGHTS.budget + MATCH_WEIGHTS.condition + MATCH_WEIGHTS.text);
});

test("xbox in ankara scores lower than similar ps5 nearby", () => {
  const close = scoreRequestMatch(profile, request({ id: "b", title: "PS5 Slim", maxBudget: "19500" }));
  const far = scoreRequestMatch(profile, request({
    id: "c",
    title: "Xbox Series X",
    city: "Ankara",
    district: "Çankaya",
    maxBudget: "18000",
    category: { id: "c2", name: "Konsol", slug: "oyun-konsolu" },
  }));
  assert.ok(close > far);
});

test("results are sorted by total score", () => {
  const ranked = rankRequests(profile, [
    request({ id: "far", city: "Ankara", district: "Çankaya", title: "Xbox Series X" }),
    request({ id: "near", title: "PS5 Slim", maxBudget: "19500" }),
  ]);
  assert.equal(ranked[0].id, "near");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("rejected withdrawn expired offers score zero", () => {
  assert.equal(scoreOfferMatchResult(profile, offer({ status: "REJECTED" })).score, 0);
  assert.equal(scoreOfferMatchResult(profile, offer({ status: "WITHDRAWN" })).score, 0);
  assert.equal(scoreOfferMatchResult(profile, offer({ status: "EXPIRED" })).score, 0);
});

test("in-budget local PS5 offer ranks above over-budget unrelated offer", () => {
  const ranked = rankOffers(profile, [
    offer({ id: "high", price: "25000", description: "başka ürün", sellerCity: "Ankara", sellerDistrict: "Çankaya", condition: "NEW" }),
    offer({ id: "fit", price: "19500", description: "PS5 Slim", sellerCity: "İzmir", sellerDistrict: "Bornova", condition: "USED" }),
  ]);
  assert.equal(ranked[0].id, "fit");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("offer match uses seller location budget and reasons", () => {
  const result = scoreOfferMatchResult(profile, offer({}));
  assert.equal(result.score, MATCH_WEIGHTS.category + MATCH_WEIGHTS.city + MATCH_WEIGHTS.district + MATCH_WEIGHTS.budget + MATCH_WEIGHTS.condition + MATCH_WEIGHTS.text);
  assert.deepEqual(result.reasons, [
    "Kategori eşleşiyor",
    "İl eşleşiyor",
    "İlçe eşleşiyor",
    "Teklif bütçenize uygun",
    "Ürün durumu eşleşiyor",
    "Ürün/metin benzerliği",
  ]);
});
