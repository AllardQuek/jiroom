"use client";

import { Palette, ListChecks } from "lucide-react";

export type ColorMode = "status" | "area";

interface MarkerColorToggleProps {
  mode: ColorMode;
  onChange: (mode: ColorMode) => void;
}

export function MarkerColorToggle({ mode, onChange }: MarkerColorToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/40 rounded-lg p-0.5 border border-border/40">
      <button
        onClick={() => onChange("status")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
          mode === "status"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ListChecks size={12} />
        By Status
      </button>
      <button
        onClick={() => onChange("area")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
          mode === "area"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Palette size={12} />
        By Area
      </button>
    </div>
  );
}
