"use client";

import { useState } from "react";
import { useListingStore } from "@/store/listingStore";
import { Listing } from "@/types/listing";
import { ListingCard } from "./ListingCard";
import { Home } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

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

function DraggableListing({
  listing,
  onClick,
}: {
  listing: Listing;
  onClick?: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: listing.id,
    data: { listing },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-30" : ""}
    >
      <ListingCard listing={listing} onClick={onClick} />
    </div>
  );
}

function DroppableColumn({
  dropStatus,
  children,
}: {
  dropStatus: ListingStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${dropStatus}`,
    data: { dropStatus },
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[560px] flex-col rounded-xl bg-muted/30 transition-colors ${
        isOver ? "bg-primary/5 ring-2 ring-primary/30" : ""
      }`}
    >
      {children}
    </section>
  );
}

export function ListingList({ onListingClick }: ListingListProps) {
  const listings = useListingStore((state) => state.listings);
  const updateListing = useListingStore((state) => state.updateListing);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeListing = activeId
    ? listings.find((l) => l.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const listingId = active.id as string;
    const dropStatus = over.data.current?.dropStatus as
      | ListingStatus
      | undefined;
    if (dropStatus) {
      updateListing(listingId, { status: dropStatus });
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {statusPanels.map((panel) => {
            const columnListings = listings.filter((listing) =>
              panel.statuses.includes(listing.status)
            );

            return (
              <DroppableColumn
                key={panel.dropStatus}
                dropStatus={panel.dropStatus}
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
                      <DraggableListing
                        key={listing.id}
                        listing={listing}
                        onClick={onListingClick}
                      />
                    ))
                  ) : (
                    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border/40 bg-background/40 p-4 text-center text-xs text-muted-foreground/50">
                      Drop listings here
                    </div>
                  )}
                </div>
              </DroppableColumn>
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

      <DragOverlay dropAnimation={null}>
        {activeListing ? (
          <div className="opacity-90">
            <ListingCard listing={activeListing} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
