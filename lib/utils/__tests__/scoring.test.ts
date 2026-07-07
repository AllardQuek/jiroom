import { describe, it, expect } from "vitest";
import { getDisplayPrice, getScoringPrice } from "@/lib/utils";
import { calculateScore } from "@/lib/utils/calculateScore";
import type { Listing } from "@/types/listing";
import type { Evaluation, Template } from "@/types/evaluation";

// Minimal template with one derived "total monthly cost" criterion (c0)
// derived from c2 (utility) + c4 (additional).
// Tier: <= 1200 => 0 (neutral), > 1200 => -1 (expensive).
function makeTemplate(): Template {
  return {
    id: "t",
    name: "test",
    criteria: [
      {
        id: "c0",
        type: "derived",
        label: "Total monthly cost",
        derivedFrom: ["c2", "c4"],
        thresholds: [
          { max: 1200, score: 0 },
          { min: 1200, score: -1 },
        ],
      } as unknown as Template["criteria"][number],
    ],
  } as unknown as Template;
}

const listing = { id: "l1", price: 900 } as Listing;
// c0 is the persisted "total monthly cost" (base + utility + additional).
// calculateScore only enters the derived branch if responses[c0] is present,
// so the real evaluation payload includes it.
const evaluation = {
  listing_id: "l1",
  responses: { c0: 1100, c2: 100, c4: 100 },
} as unknown as Evaluation;

describe("pricing helpers", () => {
  it("getDisplayPrice returns base + utility + additional ONCE (single count)", () => {
    // 900 + 100 + 100 = 1100, counted a single time
    expect(getDisplayPrice(listing, evaluation)).toBe(1100);
  });

  it("getScoringPrice returns BASE rent (costs are summed inside calculateScore)", () => {
    expect(getScoringPrice(listing, evaluation)).toBe(900);
  });
});

describe("calculateScore derived criterion", () => {
  it("scores total = base + c2 + c4 (single count), not doubled", () => {
    const result = calculateScore(
      evaluation.responses,
      makeTemplate(),
      getScoringPrice(listing, evaluation)
    );
    expect(result).not.toBeNull();
    // derivedValue = 900 + 100 + 100 = 1100 -> <= 1200 -> neutral (0)
    expect(result!.net).toBe(0);
  });

  it("regression guard: never pass getDisplayPrice (cost-inclusive) as listingPrice", () => {
    const base = getScoringPrice(listing, evaluation); // 900
    const display = getDisplayPrice(listing, evaluation); // 1100 (base + costs)
    expect(display).toBe(base + 100 + 100);

    const correct = calculateScore(evaluation.responses, makeTemplate(), base);
    const wrong = calculateScore(evaluation.responses, makeTemplate(), display);
    // correct: 900 + 100 + 100 = 1100 -> 0
    // wrong:   1100 + 100 + 100 = 1300 -> -1  (costs counted twice)
    expect(correct!.net).toBe(0);
    expect(wrong!.net).toBe(-1);
    expect(wrong!.net).not.toBe(correct!.net);
  });
});
