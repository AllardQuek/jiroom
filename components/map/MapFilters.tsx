"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "to_view", label: "To View" },
  { value: "viewed", label: "Viewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "archived", label: "Archived" },
] as const;

interface Filters {
  status: string[];
  priceMin: number | null;
  priceMax: number | null;
  showAnchors: boolean;
}

interface MapFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function MapFilters({ filters, onFiltersChange }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (value: string) => {
    const next = filters.status.includes(value)
      ? filters.status.filter((s) => s !== value)
      : [...filters.status, value];
    onFiltersChange({ ...filters, status: next });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null;

  return (
    <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="self-start flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:bg-background transition-colors"
      >
        <SlidersHorizontal size={14} />
        Filters
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-primary" />
        )}
      </button>

      {isOpen && (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-md space-y-3">
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
        </div>
      )}
    </div>
  );
}
