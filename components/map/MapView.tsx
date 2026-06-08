"use client";

import { useState } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { useListingStore } from "@/store/listingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { Listing } from "@/types/listing";
import { MapFilters } from "./MapFilters";

const STATUS_COLORS: Record<string, string> = {
  new: "#9CA3AF",
  to_view: "#3B82F6",
  viewed: "#F59E0B",
  shortlisted: "#22C55E",
  archived: "#D1D5DB",
};

interface Filters {
  status: string[];
  priceMin: number | null;
  priceMax: number | null;
}

interface MapViewProps {
  onViewDetails?: (listingId: string) => void;
}

export default function MapView({ onViewDetails }: MapViewProps) {
  const listings = useListingStore((state) => state.listings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    priceMin: null,
    priceMax: null,
  });

  const filteredListings = listings.filter((l) => {
    if (!l.lat || !l.lng) return false;
    if (filters.status.length > 0 && !filters.status.includes(l.status))
      return false;
    if (filters.priceMin !== null && l.price < filters.priceMin) return false;
    if (filters.priceMax !== null && l.price > filters.priceMax) return false;
    return true;
  });

  return (
    <div className="relative w-full h-full">
      <MapFilters filters={filters} onFiltersChange={setFilters} />
      <Map
        defaultCenter={{ lat: 1.3521, lng: 103.8198 }}
        defaultZoom={12}
        mapId="DEMO_MAP_ID"
        className="w-full h-full"
        disableDefaultUI={false}
        onClick={() => setSelectedListing(null)}
      >
        {filteredListings.map((listing) => (
          <AdvancedMarker
            key={listing.id}
            position={{ lat: listing.lat!, lng: listing.lng! }}
            onClick={() => setSelectedListing(listing)}
          >
            <Pin
              background={STATUS_COLORS[listing.status] || "#9CA3AF"}
              borderColor="#374151"
              glyphColor="#FFFFFF"
              scale={1.2}
            />
          </AdvancedMarker>
        ))}

        {selectedListing && (
          <InfoWindow
            position={{ lat: selectedListing.lat!, lng: selectedListing.lng! }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <ListingPreviewCard
              listing={selectedListing}
              onViewDetails={onViewDetails}
            />
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

function ListingPreviewCard({
  listing,
  onViewDetails,
}: {
  listing: Listing;
  onViewDetails?: (id: string) => void;
}) {
  const evaluation = useEvaluationStore((state) =>
    state.getEvaluationByListingId(listing.id)
  );
  const templates = useTemplateStore((state) => state.templates);
  const template = templates[0];
  const score =
    evaluation && template
      ? calculateScore(evaluation.responses, template)
      : null;

  return (
    <div className="text-sm min-w-[200px] max-w-[260px] space-y-2">
      <h3 className="font-semibold leading-snug">{listing.title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="font-bold text-base">
          ${listing.price.toLocaleString()}
        </span>
        <span className="text-muted-foreground text-xs">/mo</span>
      </div>
      {listing.area && (
        <p className="text-xs text-muted-foreground">{listing.area}</p>
      )}
      <div className="flex items-center gap-2 text-xs">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
          style={{
            backgroundColor: STATUS_COLORS[listing.status] + "20",
            color: STATUS_COLORS[listing.status],
          }}
        >
          {listing.status.replace("_", " ")}
        </span>
        {score !== null && (
          <span className="font-semibold">Score: {score}</span>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(listing.id)}
            className="text-xs text-primary hover:underline font-medium"
          >
            View Details
          </button>
        )}
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline font-medium"
        >
          Open source
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline font-medium"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
