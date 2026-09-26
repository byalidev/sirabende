import assert from "node:assert/strict";
import test from "node:test";
import { formatConversationTime, formatMessageReadState, getMessageDateLabel } from "./messaging-format";

test("message read state shows delivered and read correctly", () => {
  assert.equal(formatMessageReadState({ sentByMe: true, readAt: null }), "sent");
  assert.equal(formatMessageReadState({ sentByMe: true, readAt: "2026-09-26T10:42:00.000Z" }), "read");
  assert.equal(formatMessageReadState({ sentByMe: false, readAt: null }), "none");
});

test("conversation timestamps use human-friendly labels", () => {
  const today = new Date();
  assert.equal(formatConversationTime(new Date(today.getTime() - 30 * 60 * 1000).toISOString()), "Bugün");
  assert.equal(formatConversationTime(new Date(today.getTime() - 26 * 60 * 60 * 1000).toISOString()), "Dün");
  assert.equal(getMessageDateLabel(new Date("2026-09-25T10:00:00.000Z")), "25 Eylül");
});
