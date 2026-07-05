"use client";

import type { TravelMode } from "@/store/routePrefsStore";
import { useTranslations } from "next-intl";

interface TravelModeToggleProps {
  mode: TravelMode | null;
  onChange: (mode: TravelMode | null) => void;
}

export function TravelModeToggle({ mode, onChange }: TravelModeToggleProps) {
  const t = useTranslations("map.travelMode");
  const OPTIONS: { value: TravelMode; label: string }[] = [
    { value: "TRANSIT", label: t("transit") },
    { value: "DRIVING", label: t("drive") },
    { value: "WALKING", label: t("walk") },
    { value: "BICYCLING", label: t("bike") },
  ];
  return (
    <div className="relative group">
      <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg p-0.5 border border-border/40">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(mode === opt.value ? null : opt.value)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              mode === opt.value
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground hover:bg-muted/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="absolute right-0 max-sm:left-0 top-full mt-2 w-56 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg shadow-xl px-3 py-2 text-xs space-y-1">
          <p className="font-medium">{t("hoverTitle")}</p>
          <p className="text-muted-foreground">{t("hoverDescription")}</p>
        </div>
      </div>
    </div>
  );
}
