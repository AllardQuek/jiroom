import { useMemo } from "react";
import { Criterion } from "@/types/evaluation";

/**
 * Custom hook to calculate the derived total value for a derived criterion.
 * This hook calculates the total by starting with the listing price and adding
 * the values from any dependent criteria responses.
 *
 * @param derivedCriterion - The derived criterion to calculate (undefined if no derived criterion exists)
 * @param listingPrice - The base listing price (undefined if not available)
 * @param responses - The evaluation responses mapping criterion IDs to their values
 * @returns The total derived value or null if calculation is not possible
 *
 * @example
 * ```tsx
 * const derivedTotal = useDerivedTotal(derivedCriterion, listingPrice, responses);
 * if (derivedTotal !== null) {
 *   console.log(`Total: $${derivedTotal}`);
 * }
 * ```
 */
export function useDerivedTotal(
  derivedCriterion: Criterion | undefined,
  listingPrice: number | undefined,
  responses: Record<string, number | string>
) {
  return useMemo(() => {
    if (!derivedCriterion || listingPrice === undefined) return null;
    let total = listingPrice;
    if (derivedCriterion.derivedFrom) {
      for (const depId of derivedCriterion.derivedFrom) {
        const depResponse = responses[depId];
        if (depResponse !== undefined && depResponse !== "") {
          total += Number(depResponse) || 0;
        }
      }
    }
    return total;
  }, [derivedCriterion, listingPrice, responses]);
}
