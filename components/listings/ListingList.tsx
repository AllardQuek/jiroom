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
import { DraggableListing } from "./DraggableListing";
import { SortButton } from "./SortButton";
import { DroppableColumn } from "./DroppableColumn";
import { useListingDragDrop } from "./hooks/useListingDragDrop";
import { Home } from "lucide-react";
import { calculateScore } from "@/lib/utils/calculateScore";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import type { ListingFilters } from "./FilterDialog";

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

type SortField = "price" | "score" | "name" | "date" | "area" | "created_date" | "modified_date";
type SortDir = "asc" | "desc";

interface SortConfig {
  by: SortField;
  dir: SortDir;
}

interface ListingListProps {
  onListingClick?: (id: string) => void;
  compact?: boolean;
  compareMode?: boolean;
  filters?: ListingFilters;
}

const SORT_OPTIONS = [
  { label: "Default", value: null },
  { label: "Highest Price", value: { by: "price" as const, dir: "desc" as const } },
  { label: "Lowest Price", value: { by: "price" as const, dir: "asc" as const } },
  { label: "Highest Score", value: { by: "score" as const, dir: "desc" as const } },
  { label: "Lowest Score", value: { by: "score" as const, dir: "asc" as const } },
  { label: "Name A-Z", value: { by: "name" as const, dir: "asc" as const } },
  { label: "Name Z-A", value: { by: "name" as const, dir: "desc" as const } },
  { label: "Newest First", value: { by: "created_date" as const, dir: "desc" as const } },
  { label: "Oldest First", value: { by: "created_date" as const, dir: "asc" as const } },
  { label: "Recently Modified", value: { by: "modified_date" as const, dir: "desc" as const } },
  { label: "Least Recently Modified", value: { by: "modified_date" as const, dir: "asc" as const } },
] as const;

export function ListingList({
  onListingClick,
  compact,
  compareMode,
  filters,
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
  const [sortConfigs, setSortConfigs] = useState<
    Record<string, SortConfig | null>
  >({});
  const [openSortCol, setOpenSortCol] = useState<string | null>(null);
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const templates = useTemplateStore((state) => state.templates);

  const template = templates[0];

  const { activeId, sensors, handleDragStart, handleDragEnd } = useListingDragDrop({
    updateListing,
    updateVerdict,
    addVerdict,
  });

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
          case "created_date":
            cmp =
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime();
            break;
          case "modified_date":
            cmp =
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime();
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

  const activeListing = activeId
    ? listings.find((l) => l.id === activeId)
    : null;

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

  const filteredListings = listings.filter((l) => {
    if (!filters) return true;
    if (filters.hideTaken && l.is_taken) return false;
    if (filters.areas.length > 0 && (!l.area || !filters.areas.includes(l.area))) return false;
    if (filters.priceMin !== null && l.price < filters.priceMin) return false;
    if (filters.priceMax !== null && l.price > filters.priceMax) return false;
    return true;
  });

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
                    filteredListings.filter((l) => col.filter(l, getVerdict(l.id)))
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
                    filteredListings.filter((l) => col.filter(l, getVerdict(l.id)))
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
                    filteredListings.filter((l) => {
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
              filteredListings.filter(
                (l) => col.filter(l, getVerdict(l.id)) && extraFilter(l)
              ),
              sortConfigs[col.id] ?? null
            );

            return (
              <DroppableColumn
                key={col.id}
                columnId={col.id}
                dropData={col.dropData}
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
                      {col.id === "to_view" ? "No listings yet. Tap + to add your first listing" : "No viewed listings yet"}
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
