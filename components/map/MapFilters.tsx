"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CommuteFilter } from "@/components/distance/CommuteFilter";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "to_view", label: "To View" },
  { value: "viewed", label: "Viewed" },
] as const;

const VERDICT_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
] as const;

export interface Filters {
  status: string[];
  priceMin: number | null;
  priceMax: number | null;
  showAnchors: boolean;
  areas: string[];
  scoreMin: number | null;
  scoreMax: number | null;
  verdict: string[];
  hideTaken: boolean;
}

interface MapFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  areaColors?: Record<string, string>;
  areaOptions?: string[];
}

export function MapFilters({
  filters,
  onFiltersChange,
  areaColors = {},
  areaOptions = [],
}: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleStatus = (value: string) => {
    const next = filters.status.includes(value)
      ? filters.status.filter((s) => s !== value)
      : [...filters.status, value];
    onFiltersChange({ ...filters, status: next });
  };

  const toggleArea = (value: string) => {
    const next = filters.areas.includes(value)
      ? filters.areas.filter((a) => a !== value)
      : [...filters.areas, value];
    onFiltersChange({ ...filters, areas: next });
  };

  const toggleVerdict = (value: string) => {
    const next = filters.verdict.includes(value)
      ? filters.verdict.filter((v) => v !== value)
      : [...filters.verdict, value];
    onFiltersChange({ ...filters, verdict: next });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.areas.length > 0 ||
    filters.scoreMin !== null ||
    filters.scoreMax !== null ||
    filters.verdict.length > 0 ||
    filters.hideTaken;

  return (
    <div
      ref={panelRef}
      className="absolute max-sm:top-3 max-sm:right-28 sm:top-16 sm:left-3 z-10 flex flex-col gap-2"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-start flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl max-sm:rounded-lg max-sm:px-2.5 max-sm:py-2 px-5 py-3 text-sm font-semibold shadow-md hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <SlidersHorizontal size={18} />
        <span className="hidden sm:inline">Filters</span>
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </button>

      {isOpen && (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-md space-y-3 max-h-[70vh] overflow-y-auto w-80 max-sm:w-[calc(100vw-2rem)] max-sm:fixed max-sm:inset-x-4 max-sm:top-24 max-sm:max-h-[60vh]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Status</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleStatus(opt.value)}
                className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  filters.status.includes(opt.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border/30 pt-3">
            <span className="text-xs font-semibold">Verdict</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {VERDICT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleVerdict(opt.value)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                    filters.verdict.includes(opt.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {areaOptions.length > 0 && (
            <div className="border-t border-border/30 pt-3">
              <span className="text-xs font-semibold">Area</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {areaOptions.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                      filters.areas.includes(area)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
                    }`}
                  >
                    {areaColors[area] && (
                      <span
                        className="h-2 w-2 rounded-full mr-1 inline-block"
                        style={{ backgroundColor: areaColors[area] }}
                      />
                    )}
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border/30 pt-3">
            <span className="text-xs font-semibold">Score</span>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="number"
                min={-20}
                max={20}
                step={1}
                placeholder="Min"
                value={filters.scoreMin ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    scoreMin:
                      e.target.value !== "" ? Number(e.target.value) : null,
                  })
                }
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <input
                type="number"
                min={-20}
                max={20}
                step={1}
                placeholder="Max"
                value={filters.scoreMax ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    scoreMax:
                      e.target.value !== "" ? Number(e.target.value) : null,
                  })
                }
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="border-t border-border/30 pt-3">
            <span className="text-xs font-semibold">Price range</span>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMin: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMax: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <CommuteFilter />

          <div className="border-t border-border/30 pt-3">
            <span className="text-xs font-semibold">Anchors</span>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    showAnchors: !filters.showAnchors,
                  })
                }
                className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  filters.showAnchors
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
                }`}
              >
                Show anchors
              </button>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3">
            <span className="text-xs font-semibold">Taken Listings</span>
            <div className="flex items-center gap-2 mt-1.5">
              <button
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    hideTaken: !filters.hideTaken,
                  })
                }
                className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  filters.hideTaken
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
                }`}
              >
                Hide taken
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
