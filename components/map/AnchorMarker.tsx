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
      <div
        className="w-4 h-4 rotate-45 border-2 border-white shadow-md cursor-pointer"
        style={{ backgroundColor: color }}
      />
    </AdvancedMarker>
  );
}
