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
  );
}
