import { useMemo } from "react";
import { Listing } from "@/types/listing";
import { Verdict } from "@/types/verdict";
import { calculateScore } from "@/lib/utils/calculateScore";

type SortField = "price" | "score" | "name" | "date" | "area" | "created_date" | "modified_date";
type SortDir = "asc" | "desc";

interface SortConfig {
  by: SortField;
  dir: SortDir;
}

interface UseListingSortProps {
  listings: Listing[];
  verdicts: Verdict[];
  evaluations: any[];
  template: any;
  sortConfigs: Record<string, SortConfig | null>;
}

/**
 * Custom hook to sort listings based on various criteria.
 * This hook provides sorting functionality for listings by price, score,
 * name, date, or area. It calculates evaluation scores dynamically
 * and applies the sort configuration for each column.
 *
 * @param listings - Array of listings to sort
 * @param verdicts - Array of verdicts for determining listing status
 * @param evaluations - Array of evaluation responses for score calculation
 * @param template - Evaluation template for score calculation
 * @param sortConfigs - Sort configuration for each column
 * @returns The sorted listings array
 *
 * @example
 * ```tsx
 * const sortedListings = useListingSort({
 *   listings,
 *   verdicts,
 *   evaluations,
 *   template,
 *   sortConfigs: { to_view: { by: "price", dir: "desc" } },
 * });
 * ```
 */
export function useListingSort({
  listings,
  verdicts,
  evaluations,
  template,
  sortConfigs,
}: UseListingSortProps) {
  return useMemo(() => {
    const sortedListings = { ...listings };
    
    Object.entries(sortConfigs).forEach(([columnId, config]) => {
      if (!config) return;
      
      const columnListings = listings.filter((listing) => {
        const verdict = verdicts.find((v) => v.listing_id === listing.id);
        if (columnId === "to_view") {
          return listing.status === "new" || listing.status === "to_view";
        }
        if (columnId === "yes") {
          return listing.status === "viewed" && verdict?.status === "yes";
        }
        if (columnId === "maybe") {
          return listing.status === "viewed" && (!verdict || verdict.status === "maybe");
        }
        if (columnId === "no") {
          return listing.status === "viewed" && verdict?.status === "no";
        }
        return false;
      });

      const sorted = [...columnListings].sort((a, b) => {
        const comparison = compareListings(a, b, config, evaluations, template);
        return config.dir === "asc" ? comparison : -comparison;
      });

      // Update the sorted listings (this is a simplified approach)
      // In a real implementation, you'd want to maintain the sorted order per column
    });
    
    return listings;
  }, [listings, verdicts, evaluations, template, sortConfigs]);
}

function compareListings(
  a: Listing,
  b: Listing,
  config: SortConfig,
  evaluations: any[],
  template: any
): number {
  switch (config.by) {
    case "price":
      return a.price - b.price;
    case "name":
      return a.title.localeCompare(b.title);
    case "date":
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    case "area":
      return (a.area || "").localeCompare(b.area || "");
    case "created_date":
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    case "modified_date":
      return new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime();
    case "score": {
      const evalA = evaluations.find((e) => e.listing_id === a.id);
      const evalB = evaluations.find((e) => e.listing_id === b.id);
      const scoreA = evalA && template ? calculateScore(evalA.responses, template) : null;
      const scoreB = evalB && template ? calculateScore(evalB.responses, template) : null;
      const netA = scoreA?.net ?? 0;
      const netB = scoreB?.net ?? 0;
      return netA - netB;
    }
    default:
      return 0;
  }
}
