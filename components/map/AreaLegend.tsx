"use client";

interface AreaLegendProps {
  areaColors: Record<string, string>;
}

export function AreaLegend({ areaColors }: AreaLegendProps) {
  const entries = Object.entries(areaColors);

  if (entries.length === 0) return null;

  return (
    <div className="border-t border-border/30 pt-3">
      <span className="text-xs font-semibold">Areas</span>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {entries.map(([area, color]) => (
          <div
            key={area}
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border border-border/40 bg-background"
          >
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">
              {area === "" ? "Unknown" : area}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
