import { useListingStore } from "@/store/listingStore";
import { ListingCard } from "./ListingCard";

export function ListingList() {
  const listings = useListingStore((state) => state.listings);

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          You haven't saved any listings yet.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Add your first room to start comparing!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
