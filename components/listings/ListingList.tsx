"use client";

import { useState, useCallback } from "react";
import { useListingStore } from "@/store/listingStore";
import { useVerdictStore } from "@/store/verdictStore";
import { useViewingStore } from "@/store/viewingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { Listing } from "@/types/listing";
import { Verdict } from "@/types/verdict";
import { ListingCard } from "./ListingCard";
import { Home, ArrowUpDown } from "lucide-react";
import { calculateScore } from "@/lib/utils/calculateScore";
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

type SortField = "price" | "score" | "name" | "date" | "area";
type SortDir = "asc" | "desc";

interface SortConfig {
  by: SortField;
  dir: SortDir;
}

interface ListingListProps {
  onListingClick?: (id: string) => void;
  compact?: boolean;
  compareMode?: boolean;
}

function DraggableListing({
  listing,
  compact,
  compareMode,
  onClick,
}: {
  listing: Listing;
  compact?: boolean;
  compareMode?: boolean;
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
      <ListingCard
        listing={listing}
        compact={compact}
        compareMode={compareMode}
        onClick={onClick}
      />
    </div>
  );
}

const SORT_OPTIONS = [
  { label: "Default", value: null },
  { label: "Price ↓", value: { by: "price" as const, dir: "desc" as const } },
  { label: "Price ↑", value: { by: "price" as const, dir: "asc" as const } },
  { label: "Score ↓", value: { by: "score" as const, dir: "desc" as const } },
  { label: "Score ↑", value: { by: "score" as const, dir: "asc" as const } },
  { label: "Name A-Z", value: { by: "name" as const, dir: "asc" as const } },
  { label: "Name Z-A", value: { by: "name" as const, dir: "desc" as const } },
] as const;

function SortButton({
  columnId,
  options,
  sortConfigs,
  setSortConfigs,
  openSortCol,
  setOpenSortCol,
}: {
  columnId: string;
  options: readonly {
    readonly label: string;
    readonly value: SortConfig | null;
  }[];
  sortConfigs: Record<string, SortConfig | null>;
  setSortConfigs: (
    fn: (
      prev: Record<string, SortConfig | null>
    ) => Record<string, SortConfig | null>
  ) => void;
  openSortCol: string | null;
  setOpenSortCol: (id: string | null) => void;
}) {
  const config = sortConfigs[columnId] ?? null;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpenSortCol(openSortCol === columnId ? null : columnId)
        }
        className={`flex items-center rounded-md p-1 text-xs transition-colors ${
          config
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60"
        }`}
        title="Sort listings"
      >
        <ArrowUpDown size={12} />
      </button>
      {openSortCol === columnId && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenSortCol(null)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border bg-popover p-1 shadow-md">
            {options.map((opt) => {
              const isActive =
                JSON.stringify(config) === JSON.stringify(opt.value);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setSortConfigs((prev) => ({
                      ...prev,
                      [columnId]: opt.value,
                    }));
                    setOpenSortCol(null);
                  }}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function DroppableColumn({
  columnId,
  className,
  children,
}: {
  columnId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${columnId}`,
    data: { columnId },
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-[560px] flex-col rounded-xl bg-muted/30 transition-colors ${className ?? ""} ${
        isOver ? "bg-primary/5 ring-2 ring-primary/30" : ""
      }`}
    >
      {children}
    </section>
  );
}

export function ListingList({
  onListingClick,
  compact,
  compareMode,
}: ListingListProps) {
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
  const [sortConfigs, setSortConfigs] = useState<
    Record<string, SortConfig | null>
  >({});
  const [openSortCol, setOpenSortCol] = useState<string | null>(null);
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const templates = useTemplateStore((state) => state.templates);

  const template = templates[0];

  const getScore = useCallback(
    (listing: Listing) => {
      if (!template) return null;
      const ev = evaluations.find((e) => e.listing_id === listing.id);
      if (!ev) return null;
      return calculateScore(ev.responses, template, listing.price);
    },
    [evaluations, template]
  );

  const sortListings = useCallback(
    (listings: Listing[], config: SortConfig | null) => {
      if (!config) return listings;
      return [...listings].sort((a, b) => {
        let cmp = 0;
        switch (config.by) {
          case "price":
            cmp = a.price - b.price;
            break;
          case "name":
            cmp = a.title.localeCompare(b.title);
            break;
          case "date":
            cmp =
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime();
            break;
          case "area":
            cmp = (a.area || "").localeCompare(b.area || "");
            break;
          case "score": {
            const sa = getScore(a);
            const sb = getScore(b);
            const na = sa?.net ?? -Infinity;
            const nb = sb?.net ?? -Infinity;
            cmp = na - nb;
            break;
          }
        }
        return config.dir === "desc" ? -cmp : cmp;
      });
    },
    [getScore]
  );

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
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-2 lg:pb-2 lg:border-b lg:border-border/80">
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
          <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:pb-2 lg:border-b lg:border-border/80">
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
              <span className="ml-auto flex items-center gap-1">
                <SortButton
                  columnId="to_view"
                  options={SORT_OPTIONS}
                  sortConfigs={sortConfigs}
                  setSortConfigs={setSortConfigs}
                  openSortCol={openSortCol}
                  setOpenSortCol={setOpenSortCol}
                />
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {
                    listings.filter((l) => {
                      const base = l.status === "new" || l.status === "to_view";
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
              </span>
            </div>
          </div>
          {/* Verdict: column titles + sort */}
          <div className="hidden lg:contents">
            {columns
              .filter((c) => c.group === "viewed")
              .map((col) => (
                <div key={col.id} className="px-3.5">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-xs font-semibold">{col.title}</h2>
                    <div className="flex items-center gap-1">
                      <SortButton
                        columnId={col.id}
                        options={SORT_OPTIONS}
                        sortConfigs={sortConfigs}
                        setSortConfigs={setSortConfigs}
                        openSortCol={openSortCol}
                        setOpenSortCol={setOpenSortCol}
                      />
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {
                          listings.filter((l) =>
                            col.filter(l, getVerdict(l.id))
                          ).length
                        }
                      </span>
                    </div>
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

            const columnListings = sortListings(
              listings.filter(
                (l) => col.filter(l, getVerdict(l.id)) && extraFilter(l)
              ),
              sortConfigs[col.id] ?? null
            );

            return (
              <DroppableColumn
                key={col.id}
                columnId={col.id}
                className={
                  col.id === "to_view"
                    ? "relative after:content-[''] after:hidden after:lg:block after:absolute after:right-[-8px] after:top-0 after:w-px after:h-full after:bg-border/80"
                    : ""
                }
              >
                {/* Mobile-only title */}
                <div className="lg:hidden px-3.5 pt-3.5 pb-2">
                  {col.id === "to_view" ? (
                    <div className="flex gap-1 flex-wrap">
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
                      <span className="ml-auto flex items-center gap-1">
                        <SortButton
                          columnId={col.id}
                          options={SORT_OPTIONS}
                          sortConfigs={sortConfigs}
                          setSortConfigs={setSortConfigs}
                          openSortCol={openSortCol}
                          setOpenSortCol={setOpenSortCol}
                        />
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {columnListings.length}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold">{col.title}</h2>
                      <span className="flex items-center gap-1">
                        <SortButton
                          columnId={col.id}
                          options={SORT_OPTIONS}
                          sortConfigs={sortConfigs}
                          setSortConfigs={setSortConfigs}
                          openSortCol={openSortCol}
                          setOpenSortCol={setOpenSortCol}
                        />
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {columnListings.length}
                        </span>
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
                        compact={compact}
                        compareMode={compareMode}
                        onClick={onListingClick}
                      />
                    ))
                  ) : (
                    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border/80 bg-background/40 p-4 text-center text-xs text-muted-foreground/50">
                      Drop listings here
                    </div>
                  )}
                </div>
              </DroppableColumn>
            );
          })}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeListing ? (
          <div className="opacity-90">
            <ListingCard
              listing={activeListing}
              compact={compact}
              compareMode={compareMode}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
