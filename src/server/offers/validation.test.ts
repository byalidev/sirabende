import assert from "node:assert/strict";
import test from "node:test";
import { validateCreateOffer, OfferValidationError } from "./validation";

test("offer validation accepts rich offer metadata", () => {
  const result = validateCreateOffer({
    price: "19500",
    description: "Kutu dahil, temiz ve orijinal cihaz. Faturası var.",
    deliveryInfo: "Elden teslim",
    condition: "USED",
    warrantyType: "SELLER",
    warrantyMonths: 12,
    benefits: ["BOX_INCLUDED", "INVOICE", "FAST_DELIVERY"],
  });

  assert.equal(result.condition, "USED");
  assert.equal(result.warrantyType, "SELLER");
  assert.equal(result.warrantyMonths, 12);
  assert.deepEqual(result.benefits, ["BOX_INCLUDED", "INVOICE", "FAST_DELIVERY"]);
});

test("offer validation rejects invalid warranty metadata", () => {
  assert.throws(() => validateCreateOffer({
    price: "5000",
    description: "Güvenilir ürün. Ürün açıklaması yeterli.",
    condition: "NEW",
    warrantyType: "BROKEN",
    warrantyMonths: 5,
    benefits: ["BOX_INCLUDED"],
  }), (error) => error instanceof OfferValidationError && /garanti/i.test(error.message));

  assert.throws(() => validateCreateOffer({
    price: "5000",
    description: "Güvenilir ürün. Ürün açıklaması yeterli.",
    condition: "NEW",
    warrantyType: "SELLER",
    warrantyMonths: 0,
    benefits: ["BOX_INCLUDED"],
  }), (error) => error instanceof OfferValidationError && /garanti/i.test(error.message));
});
