import { Button } from "@/components/ui/button";
import { useComparisonStore } from "@/store/comparisonStore";
import { Plus, Check } from "lucide-react";

interface AddToCompareButtonProps {
  listingId: string;
}

export function AddToCompareButton({ listingId }: AddToCompareButtonProps) {
  const isSelected = useComparisonStore((state) => state.isSelected(listingId));
  const canAddMore = useComparisonStore((state) => state.canAddMore());
  const addToListing = useComparisonStore((state) => state.addToListing);
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);

  const handleClick = () => {
    if (isSelected) {
      removeFromComparison(listingId);
    } else if (canAddMore) {
      addToListing(listingId);
    }
  };

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={!isSelected && !canAddMore}
    >
      {isSelected ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Selected
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-1" />
          Add to Compare
        </>
      )}
    </Button>
  );
}
