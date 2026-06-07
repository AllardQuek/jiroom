import { useListingStore } from "@/store/listingStore";
import { Listing } from "@/types/listing";
import { ListingCard } from "./ListingCard";
import { Home } from "lucide-react";

type ListingStatus = Listing["status"];

const statusPanels: Array<{
  statuses: ListingStatus[];
  dropStatus: ListingStatus;
  title: string;
  subtitle: string;
}> = [
  {
    statuses: ["new", "to_view"],
    dropStatus: "to_view",
    title: "To View",
    subtitle: "Schedule and prepare",
  },
  {
    statuses: ["viewed"],
    dropStatus: "viewed",
    title: "Viewed",
    subtitle: "Evaluate and decide",
  },
  {
    statuses: ["shortlisted"],
    dropStatus: "shortlisted",
    title: "Shortlisted",
    subtitle: "Compare finalists",
  },
];

interface ListingListProps {
  onListingClick?: (id: string) => void;
}

export function ListingList({ onListingClick }: ListingListProps) {
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
        <div className="bg-primary/10 p-8 rounded-full text-primary">
          <Home size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Your hunting journey starts here
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Keep track of all the potential rooms you find. Add a listing to
            begin comparing and rating them.
          </p>
        </div>
      </div>
    );
  }

  const archivedListings = listings.filter(
    (listing) => listing.status === "archived"
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {statusPanels.map((panel) => {
          const columnListings = listings.filter((listing) =>
            panel.statuses.includes(listing.status)
          );

          return (
            <section
              key={panel.dropStatus}
              className="flex min-h-[560px] flex-col rounded-xl bg-muted/30"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const listingId = event.dataTransfer.getData("text/plain");
                if (listingId) {
                  updateListing(listingId, { status: panel.dropStatus });
                }
              }}
            >
              <div className="px-3.5 pt-3.5 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{panel.title}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {columnListings.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground/60">
                  {panel.subtitle}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-3 pt-2">
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
                      <ListingCard listing={listing} onClick={onListingClick} />
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border/40 bg-background/40 p-4 text-center text-xs text-muted-foreground/50">
                    Drop listings here
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {archivedListings.length > 0 && (
        <section className="rounded-xl bg-muted/30">
          <div className="flex items-center justify-between gap-3 px-3.5 pt-3.5 pb-2">
            <div>
              <h2 className="text-sm font-semibold">Archived</h2>
              <p className="mt-0.5 text-xs text-muted-foreground/60">
                Rejected options kept out of the active workflow
              </p>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {archivedListings.length}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto p-3 pt-2">
            {archivedListings.map((listing) => (
              <div key={listing.id} className="w-80 shrink-0">
                <ListingCard listing={listing} onClick={onListingClick} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
