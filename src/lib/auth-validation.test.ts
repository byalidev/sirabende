import assert from "node:assert/strict";
import test from "node:test";
import { isValidPassword, PASSWORD_MIN_LENGTH, passwordsMatch } from "./auth-validation";

test("password validation accepts the minimum and longer passwords", () => {
  for (const length of [8, 9, 10, 20, 21]) assert.equal(isValidPassword("p".repeat(length)), true);
});

test("password validation rejects empty and short passwords", () => {
  assert.equal(PASSWORD_MIN_LENGTH, 8);
  assert.equal(isValidPassword(""), false);
  assert.equal(isValidPassword("p".repeat(7)), false);
});

test("password confirmation must match exactly", () => {
  assert.equal(passwordsMatch("password8", "password8"), true);
  assert.equal(passwordsMatch("password8", "password9"), false);
  assert.equal(passwordsMatch("password8", "password8 "), false);
});