import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Listing } from "@/types/listing";
import { Evaluation } from "@/types/evaluation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDisplayPrice(
  listing: Listing,
  evaluation?: Evaluation
): number {
  const basePrice = listing.negotiated_price ?? listing.price;

  // If evaluation exists and has persisted derived total (c0), use it
  if (
    evaluation?.responses["c0"] !== undefined &&
    evaluation?.responses["c0"] !== ""
  ) {
    const persistedTotal = Number(evaluation.responses["c0"]);
    if (!isNaN(persistedTotal) && persistedTotal > 0) {
      return persistedTotal;
    }
  }

  // Otherwise calculate from cost responses
  if (evaluation?.responses) {
    const utilityCost = Number(evaluation.responses["c2"] || 0);
    const additionalCost = Number(evaluation.responses["c4"] || 0);

    // If either cost is provided, add to base price
    if (utilityCost > 0 || additionalCost > 0) {
      return basePrice + utilityCost + additionalCost;
    }
  }

  // Otherwise return base price
  return basePrice;
}
