"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ListingDetailModal } from "@/components/listings/ListingDetailModal";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      …
    </div>
  ),
});

export default function MapPage() {
  const [detailListingId, setDetailListingId] = useState<string | null>(null);

  return (
    <div className="h-[calc(100dvh-5rem)] w-full">
      <MapView onViewDetails={setDetailListingId} />
      <ListingDetailModal
        listingId={detailListingId ?? ""}
        open={!!detailListingId}
        onClose={() => setDetailListingId(null)}
      />
    </div>
  );
}
