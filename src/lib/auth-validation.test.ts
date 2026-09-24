import assert from "node:assert/strict";
import test from "node:test";
import { isValidPassword, isValidUsername, PASSWORD_MIN_LENGTH, passwordsMatch } from "./auth-validation";

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

test("username validation accepts Turkish letters, uppercase, and digits", () => {
  assert.equal(isValidUsername("Ali"), true);
  assert.equal(isValidUsername("Mehmet123"), true);
  assert.equal(isValidUsername("İsmail_34"), true);
  assert.equal(isValidUsername("Çınar-88"), true);
  assert.equal(isValidUsername("güzelKullanici1"), true);
});

test("username validation rejects empty and unsupported characters", () => {
  assert.equal(isValidUsername(""), false);
  assert.equal(isValidUsername("ab"), false);
  assert.equal(isValidUsername("ali@demo"), false);
  assert.equal(isValidUsername("   "), false);
  assert.equal(isValidUsername("çalışma yeri"), false);
});