import { useComparisonStore } from "@/store/comparisonStore";
import { useListingStore } from "@/store/listingStore";
import { ComparisonColumn } from "./ComparisonColumn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

export function ComparisonTable() {
  const selectedListingIds = useComparisonStore((state) => state.selectedListingIds);
  const clearComparison = useComparisonStore((state) => state.clearComparison);
  const listings = useListingStore((state) => state.listings);

  const selectedListings = listings.filter((listing) =>
    selectedListingIds.includes(listing.id)
  );

  if (selectedListings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No listings selected for comparison. Select 2-3 listings from the listings page to compare them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comparison</h2>
        <Button variant="outline" size="sm" onClick={clearComparison}>
          <X className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedListings.length}, minmax(280px, 1fr))` }}>
            {selectedListings.map((listing) => (
              <ComparisonColumn key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
