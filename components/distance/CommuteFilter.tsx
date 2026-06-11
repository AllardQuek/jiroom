"use client";

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
      <span className="text-xs font-semibold">Commute filter</span>
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
