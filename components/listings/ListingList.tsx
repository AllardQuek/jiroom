"use client";

import { useState } from "react";
import { useListingStore } from "@/store/listingStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useViewingStore } from "@/store/viewingStore";
import { Listing } from "@/types/listing";
import { Verdict } from "@/types/verdict";
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

interface Column {
  id: string;
  title: string;
  group: "not_viewed" | "viewed";
  filter: (listing: Listing, verdict?: Verdict) => boolean;
  dropData: { dropStatus: ListingStatus; dropVerdict?: "yes" | "maybe" | "no" };
}

const columns: Column[] = [
  {
    id: "to_view",
    title: "To View",
    group: "not_viewed",
    filter: (l) => l.status === "new" || l.status === "to_view",
    dropData: { dropStatus: "to_view" },
  },
  {
    id: "yes",
    title: "Yes",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && v?.status === "yes",
    dropData: { dropStatus: "viewed", dropVerdict: "yes" },
  },
  {
    id: "maybe",
    title: "Maybe",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && (!v || v.status === "maybe"),
    dropData: { dropStatus: "viewed", dropVerdict: "maybe" },
  },
  {
    id: "no",
    title: "No",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && v?.status === "no",
    dropData: { dropStatus: "viewed", dropVerdict: "no" },
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
  columnId,
  children,
}: {
  columnId: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
    data: { columnId },
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
  const verdicts = useVerdictStore((state) => state.verdicts);
  const addVerdict = useVerdictStore((state) => state.addVerdict);
  const updateVerdict = useVerdictStore((state) => state.updateVerdict);
  const viewings = useViewingStore((state) => state.viewings);
  const [toViewFilter, setToViewFilter] = useState<
    "all" | "unscheduled" | "scheduled"
  >("all");
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
    const columnId = over.data.current?.columnId as string | undefined;
    if (!columnId) return;

    const col = columns.find((c) => c.id === columnId);
    if (!col) return;

    const { dropStatus, dropVerdict } = col.dropData;
    updateListing(listingId, { status: dropStatus });

    if (dropVerdict) {
      const existing = verdicts.find((v) => v.listing_id === listingId);
      const now = new Date().toISOString();
      if (existing) {
        updateVerdict(existing.id, { status: dropVerdict, updated_at: now });
      } else {
        addVerdict({
          id: crypto.randomUUID(),
          listing_id: listingId,
          status: dropVerdict,
          created_at: now,
          updated_at: now,
        });
      }
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

  const getVerdict = (listingId: string) =>
    verdicts.find((v) => v.listing_id === listingId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Group header row */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-2 lg:pb-2 lg:border-b lg:border-border/30">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              To View
            </span>
            <span className="text-[11px] text-muted-foreground/40">
              {columns
                .filter((c) => c.group === "not_viewed")
                .reduce((sum, col) => {
                  return (
                    sum +
                    listings.filter((l) => col.filter(l, getVerdict(l.id)))
                      .length
                  );
                }, 0)}
            </span>
          </div>
          <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:pb-2 lg:border-b lg:border-border/30">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Viewed
            </span>
            <span className="text-[11px] text-muted-foreground/40">
              {columns
                .filter((c) => c.group === "viewed")
                .reduce((sum, col) => {
                  return (
                    sum +
                    listings.filter((l) => col.filter(l, getVerdict(l.id)))
                      .length
                  );
                }, 0)}
            </span>
          </div>

          {/* Column sub-header row — desktop only */}
          {/* To View: toggle pills */}
          <div className="hidden lg:block">
            <div className="flex gap-1">
              {(["all", "unscheduled", "scheduled"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setToViewFilter(opt)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    toViewFilter === opt
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {opt === "all"
                    ? "All"
                    : opt === "unscheduled"
                      ? "Unscheduled"
                      : "Scheduled"}
                </button>
              ))}
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {
                  listings.filter((l) => {
                    const base =
                      l.status === "new" || l.status === "to_view";
                    if (!base) return false;
                    if (toViewFilter === "all") return true;
                    const hasViewing = viewings.some(
                      (v) => v.listing_id === l.id
                    );
                    return toViewFilter === "scheduled"
                      ? hasViewing
                      : !hasViewing;
                  }).length
                }
              </span>
            </div>
          </div>
          {/* Verdict: column titles */}
          <div className="hidden lg:contents">
            {columns
              .filter((c) => c.group === "viewed")
              .map((col) => (
                <div key={col.id} className="px-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold">{col.title}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {
                        listings.filter((l) =>
                          col.filter(l, getVerdict(l.id))
                        ).length
                      }
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Droppable columns row */}
          {columns.map((col) => {
            const extraFilter =
              col.id === "to_view"
                ? (l: Listing) => {
                    if (toViewFilter === "all") return true;
                    const hasViewing = viewings.some(
                      (v) => v.listing_id === l.id
                    );
                    return toViewFilter === "scheduled"
                      ? hasViewing
                      : !hasViewing;
                  }
                : () => true;

            const columnListings = listings.filter(
              (l) => col.filter(l, getVerdict(l.id)) && extraFilter(l)
            );

            return (
              <DroppableColumn key={col.id} columnId={col.id}>
                {/* Mobile-only title */}
                <div className="lg:hidden px-3.5 pt-3.5 pb-2">
                  {col.id === "to_view" ? (
                    <div className="flex gap-1">
                      {(["all", "unscheduled", "scheduled"] as const).map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setToViewFilter(opt)}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                              toViewFilter === opt
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60"
                            }`}
                          >
                            {opt === "all"
                              ? "All"
                              : opt === "unscheduled"
                                ? "Unscheduled"
                                : "Scheduled"}
                          </button>
                        )
                      )}
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {columnListings.length}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold">
                        {col.title}
                      </h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {columnListings.length}
                      </span>
                    </div>
                  )}
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
