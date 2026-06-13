"use client";

import { Info } from "lucide-react";
import { useAnchorStore } from "@/store/anchorStore";
import { useRoutePrefsStore } from "@/store/routePrefsStore";

export function CommuteFilter() {
  const anchors = useAnchorStore((state) => state.anchors);
  const filterAnchorId = useRoutePrefsStore((s) => s.filterAnchorId);
  const maxCommuteMinutes = useRoutePrefsStore((s) => s.maxCommuteMinutes);
  const setFilterAnchor = useRoutePrefsStore((s) => s.setFilterAnchor);
  const setMaxCommute = useRoutePrefsStore((s) => s.setMaxCommute);

  return (
    <div className="border-t border-border/30 pt-3">
      <div className="relative group flex items-center gap-1">
        <span className="text-xs font-semibold">Commute filter</span>
        <Info size={12} className="text-muted-foreground/40 cursor-help" />
        <div className="absolute left-0 top-full mt-1.5 w-64 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <div className="bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg shadow-xl px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Select an anchor and set a max commute time to only show listings within that travel time. Commute routes are calculated on-demand using Google Maps.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-1.5">
        <select
          value={filterAnchorId ?? ""}
          onChange={(e) => setFilterAnchor(e.target.value || null)}
          className="w-full bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary"
        >
          <option value="">Any anchor</option>
          {anchors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>

        {filterAnchorId && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              Max commute:
            </span>
            <input
              type="number"
              min={1}
              placeholder="60"
              value={maxCommuteMinutes ?? ""}
              onChange={(e) =>
                setMaxCommute(e.target.value ? Number(e.target.value) : null)
              }
              className="w-20 bg-muted/50 border border-border/50 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
            />
            <span className="text-[11px] text-muted-foreground">min</span>
          </div>
        )}

        {filterAnchorId && !maxCommuteMinutes && (
          <p className="text-[10px] text-muted-foreground">
            Set a max commute time to filter listings on the map
          </p>
        )}
      </div>
    </div>
  );
}
