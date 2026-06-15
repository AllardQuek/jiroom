"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Anchor } from "@/types/anchor";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";

interface AnchorMarkerProps {
  anchor: Anchor;
  onClick?: () => void;
}

export default function AnchorMarker({ anchor, onClick }: AnchorMarkerProps) {
  const color = anchor.color || ANCHOR_COLORS[anchor.type];

  return (
    <AdvancedMarker
      position={{ lat: anchor.lat, lng: anchor.lng }}
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center cursor-pointer drop-shadow-lg">
        <div
          className="w-7 h-7 rotate-45 border-[3px] bg-white rounded-sm"
          style={{ borderColor: color }}
        />
        <span
          className="absolute text-[11px] font-bold leading-none pointer-events-none"
          style={{ color }}
        >
          A
        </span>
      </div>
    </AdvancedMarker>
  );
}
