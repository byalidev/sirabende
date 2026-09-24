import test from "node:test";
import assert from "node:assert/strict";
import { detectMessageFlags } from "./message-engine";

test("detects common Turkish profanity variants", () => {
  for (const value of ["AMK", "amk", "a.m.k", "a m k", "a-m-k"]) {
    assert.equal(detectMessageFlags(value).some((flag) => flag.type === "PROFANITY"), true, value);
  }
});

test("detects Turkish phone formats without flagging ordinary numbers", () => {
  for (const value of ["05321234567", "0532 123 45 67", "+90 532 123 45 67", "+905321234567", "0090 532 123 45 67"]) {
    assert.equal(detectMessageFlags(value).some((flag) => flag.type === "PHONE_NUMBER"), true, value);
  }
  assert.equal(detectMessageFlags("Ürün fiyatı 15000 TL").some((flag) => flag.type === "PHONE_NUMBER"), false);
});

test("detects external contact attempts and keeps ordinary messages clean", () => {
  assert.equal(detectMessageFlags("what sapp'tan yaz").some((flag) => flag.type === "EXTERNAL_CONTACT"), true);
  assert.deepEqual(detectMessageFlags("Merhaba, ürün hâlâ satılık mı?"), []);
});

test("detects a valid Turkish IBAN and ignores an invalid one", () => {
  assert.equal(detectMessageFlags("TR33 0006 1005 1978 6457 8413 26").some((flag) => flag.type === "BANKING"), true);
  assert.equal(detectMessageFlags("TR00 0006 1005 1978 6457 8413 26").some((flag) => flag.type === "BANKING"), false);
});

test("marks suspicious payment language for admin review", () => {
  assert.equal(detectMessageFlags("Kapora gönder, sonra ürünü yollarım").some((flag) => flag.type === "SUSPICIOUS_CONTENT"), true);
});