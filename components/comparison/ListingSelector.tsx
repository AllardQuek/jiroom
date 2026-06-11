"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useComparisonStore } from "@/store/comparisonStore";

interface ListingSelectorProps {
  listingId: string;
}

export function ListingSelector({ listingId }: ListingSelectorProps) {
  const isSelected = useComparisonStore((state) => state.isSelected(listingId));
  const canAddMore = useComparisonStore((state) => state.canAddMore());
  const addToListing = useComparisonStore((state) => state.addToListing);
  const removeFromComparison = useComparisonStore(
    (state) => state.removeFromComparison
  );

  const handleChange = (checked: boolean) => {
    if (checked) {
      if (canAddMore) {
        addToListing(listingId);
      }
    } else {
      removeFromComparison(listingId);
    }
  };

  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={handleChange}
      disabled={!isSelected && !canAddMore}
    />
  );
}
