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
import { Home, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { calculateScore } from "@/lib/utils/calculateScore";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { ListingFilters } from "./FilterDialog";

type ListingStatus = Listing["status"];

interface Column {
  id: string;
  title: string;
  group: "not_viewed" | "viewed";
  filter: (listing: Listing, verdict?: Verdict) => boolean;
  dropData: { dropStatus: ListingStatus; dropVerdict?: "yes" | "maybe" | "no" };
}

const COLUMN_DEFS: Omit<Column, "title">[] = [
  {
    id: "to_view",
    group: "not_viewed",
    filter: (l) => l.status === "new" || l.status === "to_view",
    dropData: { dropStatus: "to_view" },
  },
  {
    id: "yes",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && v?.status === "yes",
    dropData: { dropStatus: "viewed", dropVerdict: "yes" },
  },
  {
    id: "maybe",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && (!v || v.status === "maybe"),
    dropData: { dropStatus: "viewed", dropVerdict: "maybe" },
  },
  {
    id: "no",
    group: "viewed",
    filter: (l, v) => l.status === "viewed" && v?.status === "no",
    dropData: { dropStatus: "viewed", dropVerdict: "no" },
  },
];

const COLUMN_TITLE_KEYS: Record<string, string> = {
  to_view: "columns.toView",
  yes: "addColumn.yes",
  maybe: "addColumn.maybe",
  no: "addColumn.no",
};

type SortField =
  | "price"
  | "score"
  | "name"
  | "date"
  | "area"
  | "created_date"
  | "modified_date";
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

const SORT_OPTION_KEYS = [
  { key: "default", value: null },
  {
    key: "highestPrice",
    value: { by: "price" as const, dir: "desc" as const },
  },
  { key: "lowestPrice", value: { by: "price" as const, dir: "asc" as const } },
  {
    key: "highestScore",
    value: { by: "score" as const, dir: "desc" as const },
  },
  { key: "lowestScore", value: { by: "score" as const, dir: "asc" as const } },
  { key: "nameAZ", value: { by: "name" as const, dir: "asc" as const } },
  { key: "nameZA", value: { by: "name" as const, dir: "desc" as const } },
  {
    key: "newestFirst",
    value: { by: "created_date" as const, dir: "desc" as const },
  },
  {
    key: "oldestFirst",
    value: { by: "created_date" as const, dir: "asc" as const },
  },
  {
    key: "recentlyModified",
    value: { by: "modified_date" as const, dir: "desc" as const },
  },
  {
    key: "leastRecentlyModified",
    value: { by: "modified_date" as const, dir: "asc" as const },
  },
] as const;

export function ListingList({
  onListingClick,
  compact,
  compareMode,
  filters,
}: ListingListProps) {
  const t = useTranslations("listings");
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
  const [expandedColumns, setExpandedColumns] = useState<
    Record<string, boolean>
  >({
    to_view: true,
    yes: true,
    maybe: true,
    no: true,
  });
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const templates = useTemplateStore((state) => state.templates);

  const template = templates[0];

  const columns: Column[] = COLUMN_DEFS.map((col) => ({
    ...col,
    title: t(COLUMN_TITLE_KEYS[col.id] as any),
  }));

  const SORT_OPTIONS = SORT_OPTION_KEYS.map((opt) => ({
    label: t(`sortOptions.${opt.key}` as any),
    value: opt.value,
  }));

  const toggleColumn = (columnId: string) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const { activeId, sensors, handleDragStart, handleDragEnd } =
    useListingDragDrop({
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
            {t("emptyState.title")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {t("emptyState.description")}
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
    if (
      filters.areas.length > 0 &&
      (!l.area || !filters.areas.includes(l.area))
    )
      return false;
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
              {t("columns.toView")}
            </span>
            <span className="text-[11px] text-muted-foreground/40">
              {columns
                .filter((c) => c.group === "not_viewed")
                .reduce((sum, col) => {
                  return (
                    sum +
                    filteredListings.filter((l) =>
                      col.filter(l, getVerdict(l.id))
                    ).length
                  );
                }, 0)}
            </span>
          </div>
          <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:pb-2 lg:border-b lg:border-border/80">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {t("columns.viewed")}
            </span>
            <span className="text-[11px] text-muted-foreground/40">
              {columns
                .filter((c) => c.group === "viewed")
                .reduce((sum, col) => {
                  return (
                    sum +
                    filteredListings.filter((l) =>
                      col.filter(l, getVerdict(l.id))
                    ).length
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
                    ? t("columns.all")
                    : opt === "unscheduled"
                      ? t("columns.unscheduled")
                      : t("columns.scheduled")}
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
                      const viewing = viewings.find(
                        (v) => v.listing_id === l.id
                      );
                      const hasScheduledDate = viewing?.scheduled_date !== undefined;
                      return toViewFilter === "scheduled"
                        ? hasScheduledDate
                        : !hasScheduledDate;
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
                    const viewing = viewings.find(
                      (v) => v.listing_id === l.id
                    );
                    const hasScheduledDate = viewing?.scheduled_date !== undefined;
                    return toViewFilter === "scheduled"
                      ? hasScheduledDate
                      : !hasScheduledDate;
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
                collapsed={!expandedColumns[col.id]}
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
                      <button
                        type="button"
                        onClick={() => toggleColumn(col.id)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ease-in-out ${expandedColumns[col.id] ? "rotate-180" : ""}`}
                        />
                      </button>
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
                              ? t("columns.all")
                              : opt === "unscheduled"
                                ? t("columns.unscheduled")
                                : t("columns.scheduled")}
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleColumn(col.id)}
                          className="flex items-center justify-center rounded-md p-1 text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${expandedColumns[col.id] ? "rotate-180" : ""}`}
                          />
                        </button>
                        <h2 className="text-sm font-semibold">{col.title}</h2>
                      </div>
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
                <div
                  className="overflow-y-auto transition-all duration-300 ease-out"
                  style={{
                    maxHeight: expandedColumns[col.id] ? "2000px" : "0px",
                    opacity: expandedColumns[col.id] ? "1" : "0",
                  }}
                >
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
                        {col.id === "to_view"
                          ? t("emptyColumn.toView")
                          : t("emptyColumn.viewed")}
                      </div>
                    )}
                  </div>
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
