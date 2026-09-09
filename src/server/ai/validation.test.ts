import assert from "node:assert/strict";
import test from "node:test";
import { assertSearchQuery, filtersToSearchParams, validateAiParsedIntent } from "./validation";

const slugs = ["telefon", "bilgisayar", "oyun-konsolu"];

test("valid AI output is kept", () => {
  const intent = validateAiParsedIntent({
    query: "PS5 Slim",
    categorySlug: "oyun-konsolu",
    city: "İzmir",
    district: "Bornova",
    minBudget: 0,
    maxBudget: 20000,
    condition: "USED",
    date: "7d",
    sort: "newest",
    needsClarification: false,
    clarificationQuestion: null,
  }, slugs);
  assert.equal(intent.query, "PS5 Slim");
  assert.equal(intent.city, "İzmir");
  assert.equal(intent.district, "Bornova");
  assert.equal(intent.maxBudget, 20000);
  assert.equal(intent.condition, "USED");
});

test("invalid JSON-like missing object throws", () => {
  assert.throws(() => validateAiParsedIntent(null, slugs));
});

test("wrong types are nulled", () => {
  const intent = validateAiParsedIntent({
    query: 12,
    categorySlug: true,
    city: ["İzmir"],
    minBudget: "abc",
    condition: "USED",
  }, slugs);
  assert.equal(intent.query, null);
  assert.equal(intent.city, null);
  assert.equal(intent.minBudget, null);
  assert.equal(intent.condition, "USED");
});

test("unknown city and category are dropped while known district infers city", () => {
  const intent = validateAiParsedIntent({
    query: "PS5",
    categorySlug: "uzay-gemisi",
    city: "Gotham",
    district: "Bornova",
    condition: "OLD",
  }, slugs);
  assert.equal(intent.categorySlug, null);
  assert.equal(intent.city, "İzmir");
  assert.equal(intent.district, "Bornova");
  assert.equal(intent.condition, null);
});

test("Bornova without city resolves to İzmir", () => {
  const intent = validateAiParsedIntent({ query: "PS5", city: null, district: "Bornova" }, slugs);
  assert.equal(intent.city, "İzmir");
  assert.equal(intent.district, "Bornova");
});

test("district that does not belong to city is dropped", () => {
  const intent = validateAiParsedIntent({ city: "Ankara", district: "Bornova" }, slugs);
  assert.equal(intent.city, "Ankara");
  assert.equal(intent.district, null);
});

test("negative budget is dropped and min > max is swapped", () => {
  const negative = validateAiParsedIntent({ minBudget: -5, maxBudget: 20 }, slugs);
  assert.equal(negative.minBudget, null);
  const inverted = validateAiParsedIntent({ minBudget: 25000, maxBudget: 15000 }, slugs);
  assert.equal(inverted.minBudget, 15000);
  assert.equal(inverted.maxBudget, 25000);
});

test("URL params follow FAZ 10 names and omit page", () => {
  const params = filtersToSearchParams({
    q: "PS5 Slim",
    city: "İzmir",
    district: "Bornova",
    maxBudget: 20000,
    condition: "USED",
    page: 3,
  });
  assert.equal(params.get("q"), "PS5 Slim");
  assert.equal(params.get("city"), "İzmir");
  assert.equal(params.get("district"), "Bornova");
  assert.equal(params.get("maxBudget"), "20000");
  assert.equal(params.get("condition"), "USED");
  assert.equal(params.get("page"), null);
});

test("excessive input is rejected", () => {
  assert.throws(() => assertSearchQuery(""));
  assert.throws(() => assertSearchQuery("ab"));
  assert.throws(() => assertSearchQuery("x".repeat(1501)));
});

