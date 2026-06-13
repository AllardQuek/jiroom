"use client";

import type { TravelMode } from "@/store/routePrefsStore";

interface TravelModeToggleProps {
  mode: TravelMode;
  onChange: (mode: TravelMode) => void;
}

const OPTIONS: { value: TravelMode; label: string }[] = [
  { value: "TRANSIT", label: "Transit" },
  { value: "DRIVING", label: "Drive" },
  { value: "WALKING", label: "Walk" },
  { value: "BICYCLING", label: "Bike" },
];

export function TravelModeToggle({ mode, onChange }: TravelModeToggleProps) {
  return (
    <div className="relative group">
      <div className="flex items-center gap-0.5 bg-muted/40 rounded-lg p-0.5 border border-border/40">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              mode === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="absolute right-0 top-full mt-2 w-64 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg shadow-xl px-3 py-2 text-xs space-y-1">
          <p className="font-medium">Route mode</p>
          <p className="text-muted-foreground">
            Commute routes are calculated on-demand using Google Maps when you
            click a listing on the map. Set up anchors first via the{" "}
            <span className="font-medium">Anchors</span> panel to see routes.
          </p>
        </div>
      </div>
    </div>
  );
}
