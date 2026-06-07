"use client";

import { useListingStore } from "@/store/listingStore";
import { useViewingStore } from "@/store/viewingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format, parseISO, isAfter } from "date-fns";

export default function SchedulePage() {
  const listings = useListingStore((state) => state.listings);
  const viewings = useViewingStore((state) => state.viewings);

  // Filter and sort upcoming viewings
  const upcomingViewings = viewings
    .filter((v) => v.scheduled_date && (v.status === "upcoming" || v.status === "to_view"))
    .sort((a, b) => {
      const dateA = parseISO(a.scheduled_date!);
      const dateB = parseISO(b.scheduled_date!);
      return dateA.getTime() - dateB.getTime();
    })
    .map((viewing) => ({
      ...viewing,
      listing: listings.find((l) => l.id === viewing.listing_id),
    }))
    .filter((v) => v.listing);

  if (upcomingViewings.length === 0) {
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
          <Button variant="outline">Browse Listings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Your Schedule</h1>
        <p className="text-muted-foreground text-sm">
          {upcomingViewings.length} upcoming viewing{upcomingViewings.length > 1 ? "s" : ""}
        </p>
      </header>

      <div className="space-y-4">
        {upcomingViewings.map((viewing) => {
          const date = parseISO(viewing.scheduled_date!);
          const formattedDate = format(date, "EEEE, MMMM do");
          const formattedTime = format(date, "h:mm aa");

          return (
            <Link key={viewing.id} href={`/listings/${viewing.listing_id}`}>
              <Card className="hover:shadow-md transition-shadow group">
                <CardContent className="p-4 flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-primary/10 text-primary px-3 py-2 rounded-lg h-fit min-w-[80px]">
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      {format(date, "MMM")}
                    </span>
                    <span className="text-xl font-black">
                      {format(date, "dd")}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {viewing.listing?.title}
                    </h3>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                          ${viewing.listing?.price.toLocaleString()}
                        </span>
                        {viewing.listing?.area && <span>• {viewing.listing.area}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}