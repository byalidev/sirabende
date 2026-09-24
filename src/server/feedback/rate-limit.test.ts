import assert from "node:assert/strict";
import test from "node:test";
import { checkFeedbackCooldown } from "./rate-limit";

test("allows the first feedback submission", () => {
  assert.doesNotThrow(() => checkFeedbackCooldown([], new Date("2026-09-24T12:00:00.000Z")));
});

test("rejects feedback when less than 10 minutes have passed", () => {
  const now = new Date("2026-09-24T12:00:00.000Z");
  const recent = new Date("2026-09-24T11:58:00.000Z");

  assert.throws(
    () => checkFeedbackCooldown([{ createdAt: recent }], now),
    /dakika.*tekrar deneyin|çok sık geri bildirim/i,
  );
});

test("allows feedback after the 10 minute cooldown ends", () => {
  const now = new Date("2026-09-24T12:00:00.000Z");
  const old = new Date("2026-09-24T11:49:00.000Z");

  assert.doesNotThrow(() => checkFeedbackCooldown([{ createdAt: old }], now));
});
