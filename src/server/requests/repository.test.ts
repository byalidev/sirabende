import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRequestFilters } from "./repository";

test("featured filter is activated for premium request list", async () => {
  const filters = await normalizeRequestFilters({ featured: "1" });
  assert.equal(filters.featured, true);
  assert.equal(filters.category, undefined);
});
