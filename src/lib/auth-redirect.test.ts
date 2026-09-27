import test from "node:test";
import assert from "node:assert/strict";
import { resolvePostLoginPath } from "./auth-redirect";

test("defaults to requests page when no redirect target is provided", () => {
  assert.equal(resolvePostLoginPath(null), "/talepler");
  assert.equal(resolvePostLoginPath(undefined), "/talepler");
});

test("accepts only safe internal redirect paths", () => {
  assert.equal(resolvePostLoginPath("/talepler"), "/talepler");
  assert.equal(resolvePostLoginPath("/panel?tab=talepler"), "/panel?tab=talepler");
  assert.equal(resolvePostLoginPath("https://evil.example/steal"), "/talepler");
  assert.equal(resolvePostLoginPath("javascript:alert(1)"), "/talepler");
});
