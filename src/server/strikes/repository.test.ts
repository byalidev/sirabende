import test from "node:test";
import assert from "node:assert/strict";
import { getStrikeWarningLevel, reachesStrikeSuspensionThreshold } from "./policy";

test("strike warnings use the highest eligible severity only", () => {
  assert.equal(getStrikeWarningLevel({ lowStrikeCount: 1, mediumStrikeCount: 0, highStrikeCount: 0 }), null);
  assert.equal(getStrikeWarningLevel({ lowStrikeCount: 4, mediumStrikeCount: 0, highStrikeCount: 0 }), "LOW");
  assert.equal(getStrikeWarningLevel({ lowStrikeCount: 4, mediumStrikeCount: 3, highStrikeCount: 0 }), "MEDIUM");
  assert.equal(getStrikeWarningLevel({ lowStrikeCount: 4, mediumStrikeCount: 3, highStrikeCount: 1 }), "HIGH");
});

test("strike suspension thresholds are independent by level", () => {
  assert.equal(reachesStrikeSuspensionThreshold("LOW", 19), false);
  assert.equal(reachesStrikeSuspensionThreshold("LOW", 20), true);
  assert.equal(reachesStrikeSuspensionThreshold("MEDIUM", 9), false);
  assert.equal(reachesStrikeSuspensionThreshold("MEDIUM", 10), true);
  assert.equal(reachesStrikeSuspensionThreshold("HIGH", 2), false);
  assert.equal(reachesStrikeSuspensionThreshold("HIGH", 3), true);
});
