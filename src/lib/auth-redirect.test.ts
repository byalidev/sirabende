import test from "node:test";
import assert from "node:assert/strict";
import { resolvePostLoginPath } from "./auth-redirect";

test("defaults to the homepage when no redirect target is provided", () => {
  assert.equal(resolvePostLoginPath(null), "/");
  assert.equal(resolvePostLoginPath(undefined), "/");
});

test("accepts only safe internal redirect paths", () => {
  assert.equal(resolvePostLoginPath("/talepler"), "/talepler");
  assert.equal(resolvePostLoginPath("/panel?tab=talepler"), "/panel?tab=talepler");
  assert.equal(resolvePostLoginPath("https://evil.example/steal"), "/");
  assert.equal(resolvePostLoginPath("javascript:alert(1)"), "/");
});
