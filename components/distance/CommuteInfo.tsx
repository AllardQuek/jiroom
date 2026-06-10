"use client";

import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Anchor } from "@/types/anchor";
import { Loader2, RouteOff } from "lucide-react";

export interface RouteData {
  result: google.maps.DirectionsResult | null;
  error: string | null;
  loading: boolean;
}

interface CommuteInfoProps {
  anchors: Anchor[];
  routes: Record<string, RouteData>;
  travelModeLabel: string;
}

export function CommuteInfo({
  anchors,
  routes,
  travelModeLabel,
}: CommuteInfoProps) {
  const visibleAnchors = anchors.filter((a) => a.id in routes);

  if (visibleAnchors.length === 0) return null;

  return (
    <div className="border-t border-border/30 pt-2 mt-2">
      <span className="text-xs font-semibold text-muted-foreground block mb-1.5">
        Commute ({travelModeLabel})
      </span>
      <div className="space-y-1">
        {visibleAnchors.map((anchor) => {
          const data = routes[anchor.id];
          const color = anchor.color || ANCHOR_COLORS[anchor.type];
          const duration = data?.result?.routes[0]?.legs[0]?.duration?.text;

          return (
            <div key={anchor.id} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground flex-1 truncate">
                {anchor.title}
              </span>
              {data?.loading ? (
                <Loader2
                  size={12}
                  className="animate-spin text-muted-foreground"
                />
              ) : data?.error || !duration ? (
                <span className="text-destructive flex items-center gap-0.5 text-[10px]">
                  <RouteOff size={10} />
                  No route
                </span>
              ) : (
                <span className="font-medium whitespace-nowrap">
                  {duration}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
