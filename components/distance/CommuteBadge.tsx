"use client";

import { useAnchorStore } from "@/store/anchorStore";
import { useRoutePrefsStore } from "@/store/routePrefsStore";
import { getCachedRoute } from "@/lib/utils/routeCache";
import { MapPin } from "lucide-react";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Listing } from "@/types/listing";

interface CommuteBadgeProps {
  listing: Listing;
}

export function CommuteBadge({ listing }: CommuteBadgeProps) {
  const filterAnchorId = useRoutePrefsStore((s) => s.filterAnchorId);
  const travelMode = useRoutePrefsStore((s) => s.travelMode);
  const anchor = useAnchorStore((state) =>
    state.anchors.find((a) => a.id === filterAnchorId)
  );

  if (!filterAnchorId || !listing.lat || !listing.lng || !anchor || !travelMode)
    return null;

  const originKey = `${listing.lat},${listing.lng}`;
  const destKey = `${anchor.lat},${anchor.lng}`;
  const cached = getCachedRoute(originKey, destKey, travelMode);
  const duration = cached?.durationText;

  if (!duration) return null;

  const color = anchor.color || ANCHOR_COLORS[anchor.type];

  return (
    <div
      className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full border"
      style={{
        backgroundColor: color + "15",
        borderColor: color + "30",
        color: color,
      }}
    >
      <MapPin size={10} />
      <span>{duration}</span>
    </div>
  );
}
