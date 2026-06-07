import { useListingStore } from "@/store/listingStore";
import { Listing } from "@/types/listing";
import { ListingCard } from "./ListingCard";
import { Home } from "lucide-react";

type ListingViewMode = "grid" | "board";
type ListingStatus = Listing["status"];

interface ListingListProps {
  viewMode?: ListingViewMode;
}

const statusColumns: Array<{
  statuses: ListingStatus[];
  dropStatus: ListingStatus;
  title: string;
  action: string;
}> = [
  {
    statuses: ["new", "to_view"],
    dropStatus: "to_view",
    title: "To View",
    action: "Schedule and prepare",
  },
  {
    statuses: ["viewed"],
    dropStatus: "viewed",
    title: "Viewed",
    action: "Evaluate and decide",
  },
  {
    statuses: ["shortlisted"],
    dropStatus: "shortlisted",
    title: "Shortlisted",
    action: "Compare finalists",
  },
];

export function ListingList({ viewMode = "grid" }: ListingListProps) {
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
        <div className="bg-primary/10 p-8 rounded-full text-primary">
          <Home size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Your hunting journey starts here
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Keep track of all the potential rooms you find. Add a listing to
            begin comparing and rating them.
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "board") {
    const archivedListings = listings.filter(
      (listing) => listing.status === "archived"
    );

    return (
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {statusColumns.map((column) => {
            const columnListings = listings.filter((listing) =>
              column.statuses.includes(listing.status)
            );

            return (
              <section
                key={column.dropStatus}
                className="flex min-h-[560px] flex-col rounded-lg border border-border/70 bg-muted/20"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const listingId = event.dataTransfer.getData("text/plain");

                  if (listingId) {
                    updateListing(listingId, { status: column.dropStatus });
                  }
                }}
              >
                <div className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold">{column.title}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {columnListings.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {column.action}
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-3">
                  {columnListings.length > 0 ? (
                    columnListings.map((listing) => (
                      <div
                        key={listing.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", listing.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                      >
                        <ListingCard listing={listing} />
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed bg-background/60 p-4 text-center text-xs text-muted-foreground">
                      Drop listings here
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {archivedListings.length > 0 && (
          <section className="rounded-lg border border-border/70 bg-muted/20">
            <div className="flex items-center justify-between gap-3 border-b bg-background/95 px-3 py-3">
              <div>
                <h2 className="text-sm font-bold">Archived</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Rejected options kept out of the active workflow
                </p>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                {archivedListings.length}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto p-3">
              {archivedListings.map((listing) => (
                <div key={listing.id} className="w-80 shrink-0">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
