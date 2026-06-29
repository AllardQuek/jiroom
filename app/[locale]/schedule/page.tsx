"use client";

import { useMemo, useState } from "react";
import { useListingStore } from "@/store/listingStore";
import { useViewingStore } from "@/store/viewingStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ExternalLink,
  MapPin,
  ArrowRight,
  Home,
} from "lucide-react";
import { TakenBadge } from "@/components/listings/TakenBadge";
import { TakenTooltip } from "@/components/listings/TakenTooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isPast,
  addMinutes,
  startOfDay,
  isSameDay,
} from "date-fns";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";

type ViewingWithListing = NonNullable<
  ReturnType<typeof useViewingStore.getState>["viewings"][number]
> & {
  listing: NonNullable<
    ReturnType<typeof useListingStore.getState>["listings"][number]
  >;
};

function DaySection({
  label,
  dateLabel,
  viewings,
  onListingClick,
  isPast,
}: {
  label: string;
  dateLabel: string;
  viewings: ViewingWithListing[];
  onListingClick: (id: string) => void;
  isPast: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2 pt-4 -mx-4 px-4 lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none lg:mx-0 lg:px-0">
        <div className="flex items-baseline gap-2">
          <h2
            className={`text-base font-bold ${isPast ? "text-muted-foreground/60" : ""}`}
          >
            {isPast ? "Past — " : ""}
            {label}
          </h2>
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
        </div>
        <div className={`h-px mt-2 ${isPast ? "bg-border/30" : "bg-border"} lg:hidden`} />
      </div>

      <div className="space-y-3">
        {viewings.map((viewing) => {
          const date = parseISO(viewing.scheduled_date!);

          return (
            <button
              key={viewing.id}
              type="button"
              onClick={() => onListingClick(viewing.listing_id)}
              className="w-full text-left"
            >
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={`transition-all duration-200 group w-full ${
                        isPast
                          ? "opacity-50 border-border/30 hover:opacity-70"
                          : "hover:shadow-md active:scale-[0.99] border-border/50"
                      } ${
                        viewing.listing.is_taken ? "opacity-50" : ""
                      }`}
                    >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 px-4 py-4 min-w-0">
                    <div className="text-center shrink-0">
                      <div
                        className={`text-lg font-black tracking-tight ${
                          isPast
                            ? "text-muted-foreground/50"
                            : "text-foreground"
                        }`}
                      >
                        {format(date, "h:mm")}
                      </div>
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider leading-tight ${
                          isPast
                            ? "text-muted-foreground/40"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {format(date, "a")}
                      </div>
                    </div>

                    <div
                      className={`w-px h-10 shrink-0 ${
                        isPast ? "bg-border/20" : "bg-border/60"
                      }`}
                    />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3
                          className={`text-sm font-semibold line-clamp-1 ${
                            isPast
                              ? "text-muted-foreground/70"
                              : "group-hover:text-primary transition-colors"
                          }`}
                        >
                          {viewing.listing.title}
                        </h3>
                        {viewing.listing.source_url && (
                          <a
                            href={viewing.listing.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 p-1 -m-1 text-muted-foreground/50 hover:text-primary transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {viewing.listing.is_taken && <TakenBadge takenDate={viewing.listing.taken_date} />}
                        <span
                          className={`font-semibold ${
                            isPast
                              ? "text-muted-foreground/70"
                              : "text-foreground"
                          }`}
                        >
                          ${viewing.listing.price.toLocaleString()}
                        </span>
                        {viewing.listing.area && (
                          <>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={10} />
                              {viewing.listing.area}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      size={16}
                      className={`shrink-0 transition-colors ${
                        isPast
                          ? "text-muted-foreground/20"
                          : "text-muted-foreground/30 group-hover:text-primary"
                      }`}
                    />
                  </div>
                </CardContent>
                  </Card>
                  </TooltipTrigger>
                  {viewing.listing.is_taken && (
                    <TooltipContent>
                      <TakenTooltip takenDate={viewing.listing.taken_date} />
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );
  const listings = useListingStore((state) => state.listings);
  const viewings = useViewingStore((state) => state.viewings);

  const groupedDays = useMemo(() => {
    const filtered = viewings
      .filter((v) => v.scheduled_date)
      .map((viewing) => ({
        ...viewing,
        listing: listings.find((l) => l.id === viewing.listing_id),
      }))
      .filter((v): v is ViewingWithListing => !!v.listing);

    const sorted = filtered.sort((a, b) => {
      const dateA = parseISO(a.scheduled_date!);
      const dateB = parseISO(b.scheduled_date!);
      return dateA.getTime() - dateB.getTime();
    });

    const past: ViewingWithListing[] = [];
    const groups: {
      date: Date;
      label: string;
      dateLabel: string;
      viewings: ViewingWithListing[];
      isPast: boolean;
    }[] = [];

    for (const viewing of sorted) {
      const date = parseISO(viewing.scheduled_date!);
      if (isNaN(date.getTime())) continue;
      const day = startOfDay(date);

      if (isPast(addMinutes(date, 30))) {
        past.push(viewing);
        continue;
      }

      const existing = groups.find((g) => isSameDay(g.date, day));
      if (existing) {
        existing.viewings.push(viewing);
      } else {
        let label: string;
        if (isToday(day)) {
          label = "Today";
        } else if (isTomorrow(day)) {
          label = "Tomorrow";
        } else {
          label = format(day, "EEEE");
        }
        groups.push({
          date: day,
          label,
          dateLabel: format(day, "MMM d, yyyy"),
          isPast: false,
          viewings: [viewing],
        });
      }
    }

    if (past.length > 0) {
      const pastGroups: {
        date: Date;
        label: string;
        dateLabel: string;
        viewings: ViewingWithListing[];
        isPast: boolean;
      }[] = [];
      for (const viewing of past) {
        const date = parseISO(viewing.scheduled_date!);
        if (isNaN(date.getTime())) continue;
        const day = startOfDay(date);
        const existing = pastGroups.find((g) => isSameDay(g.date, day));
        if (existing) {
          existing.viewings.push(viewing);
        } else {
          pastGroups.push({
            date: day,
            label: format(day, "EEEE"),
            dateLabel: format(day, "MMM d, yyyy"),
            isPast: true,
            viewings: [viewing],
          });
        }
      }
      groups.push(...pastGroups.reverse());
    }

    return groups;
  }, [viewings, listings]);

  const totalCount = groupedDays.reduce((sum, g) => sum + g.viewings.length, 0);

  if (totalCount === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <CalendarDays size={48} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">No viewings scheduled</h2>
          <p className="text-muted-foreground max-w-xs">
            Any upcoming viewings you schedule will appear here for easy access.
          </p>
        </div>
        <Link href="/listings">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-1.5" />
            Browse Listings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-2">
      <header className="pb-2">
        <h1 className="text-2xl font-bold">Your Schedule</h1>
        <p className="text-sm text-muted-foreground">
          {totalCount} viewing{totalCount !== 1 ? "s" : ""} scheduled
        </p>
      </header>

      <div className="space-y-6 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 lg:space-y-0 lg:items-start">
        {groupedDays.map((group) => (
          <DaySection
            key={group.date.toISOString()}
            label={group.label}
            dateLabel={group.dateLabel}
            viewings={group.viewings}
            onListingClick={setSelectedListingId}
            isPast={group.isPast}
          />
        ))}
      </div>

      {selectedListingId && (
        <ListingDetailModal
          listingId={selectedListingId}
          open={!!selectedListingId}
          onClose={() => setSelectedListingId(null)}
        />
      )}
    </div>
  );
}
