"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useListingStore } from "@/store/listingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useAnchorStore } from "@/store/anchorStore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Listing } from "@/types/listing";
import { Anchor } from "@/types/anchor";
import { MapFilters } from "./MapFilters";
import AnchorMarker from "./AnchorMarker";
import AnchorPanel from "./AnchorPanel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateListingForm } from "@/components/listings/CreateListingForm";
import { CreateAnchorForm } from "@/components/anchors/CreateAnchorForm";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, List } from "lucide-react";
import dynamic from "next/dynamic";

const LocationSearch = dynamic(() => import("./LocationSearch"), {
  ssr: false,
});

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
  showAnchors: boolean;
}

interface MapViewProps {
  onViewDetails?: (listingId: string) => void;
}

interface SearchResult {
  title: string;
  area: string;
  lat: number;
  lng: number;
  googlePlaceId: string;
}

function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const calledRef = useRef(false);
  useEffect(() => {
    if (map && !calledRef.current) {
      calledRef.current = true;
      map.panTo({ lat, lng });
      map.setZoom(16);
    }
  }, [map, lat, lng]);
  return null;
}

export default function MapView({ onViewDetails }: MapViewProps) {
  const listings = useListingStore((state) => state.listings);
  const anchors = useAnchorStore((state) => state.anchors);
  const deleteAnchor = useAnchorStore((state) => state.deleteAnchor);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<Anchor | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    priceMin: null,
    priceMax: null,
    showAnchors: true,
  });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showCreateListingDialog, setShowCreateListingDialog] = useState(false);
  const [showCreateAnchorDialog, setShowCreateAnchorDialog] = useState(false);
  const [showAnchorPanel, setShowAnchorPanel] = useState(false);

  const filteredListings = listings.filter((l) => {
    if (!l.lat || !l.lng) return false;
    if (filters.status.length > 0 && !filters.status.includes(l.status))
      return false;
    if (filters.priceMin !== null && l.price < filters.priceMin) return false;
    if (filters.priceMax !== null && l.price > filters.priceMax) return false;
    return true;
  });

  const visibleAnchors = filters.showAnchors ? anchors : [];

  const handlePlaceSelect = useCallback((place: SearchResult) => {
    setSelectedListing(null);
    setSelectedAnchor(null);
    setSearchResult(place);
  }, []);

  const handleAnchorSelect = useCallback(
    (anchor: Anchor) => {
      setSelectedAnchor(anchor);
      setSelectedListing(null);
      setShowAnchorPanel(false);
    },
    []
  );

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <LocationSearch onPlaceSelect={handlePlaceSelect} />
      </div>
      <MapFilters filters={filters} onFiltersChange={setFilters} />
      <button
        onClick={() => setShowAnchorPanel(true)}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:bg-background transition-colors"
      >
        <List size={14} />
        Anchors
      </button>
      <Map
        defaultCenter={{ lat: 1.3521, lng: 103.8198 }}
        defaultZoom={12}
        mapId="DEMO_MAP_ID"
        className="w-full h-full"
        disableDefaultUI={false}
        onClick={() => {
          setSelectedListing(null);
          setSelectedAnchor(null);
        }}
      >
        {filteredListings.map((listing) => (
          <AdvancedMarker
            key={listing.id}
            position={{ lat: listing.lat!, lng: listing.lng! }}
            onClick={() => {
              setSelectedListing(listing);
              setSelectedAnchor(null);
            }}
          >
            <Pin
              background={STATUS_COLORS[listing.status] || "#9CA3AF"}
              borderColor="#374151"
              glyphColor="#FFFFFF"
              scale={1.2}
            />
          </AdvancedMarker>
        ))}

        {visibleAnchors.map((anchor) => (
          <AnchorMarker
            key={anchor.id}
            anchor={anchor}
            onClick={() => {
              setSelectedAnchor(anchor);
              setSelectedListing(null);
            }}
          />
        ))}

        {searchResult && (
          <AdvancedMarker
            position={{ lat: searchResult.lat, lng: searchResult.lng }}
          >
            <Pin
              background="#6366F1"
              borderColor="#4338CA"
              glyphColor="#FFFFFF"
              scale={1.4}
            />
          </AdvancedMarker>
        )}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: selectedListing.lat!,
              lng: selectedListing.lng!,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <ListingPreviewCard
              listing={selectedListing}
              onViewDetails={onViewDetails}
            />
          </InfoWindow>
        )}

        {selectedAnchor && (
          <InfoWindow
            position={{
              lat: selectedAnchor.lat,
              lng: selectedAnchor.lng,
            }}
            onCloseClick={() => setSelectedAnchor(null)}
          >
            <AnchorInfoWindow
              anchor={selectedAnchor}
              onEdit={() => {
                setShowCreateAnchorDialog(true);
              }}
              onDelete={() => {
                deleteAnchor(selectedAnchor.id);
                setSelectedAnchor(null);
              }}
            />
          </InfoWindow>
        )}

        {searchResult && (
          <MapController lat={searchResult.lat} lng={searchResult.lng} />
        )}
      </Map>

      {searchResult && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          <Button
            onClick={() => setShowCreateListingDialog(true)}
            className="shadow-lg gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Listing
          </Button>
          <Button
            onClick={() => setShowCreateAnchorDialog(true)}
            variant="secondary"
            className="shadow-lg gap-2"
            size="lg"
          >
            <MapPin className="h-4 w-4" />
            Anchor
          </Button>
        </div>
      )}

      <Dialog
        open={showCreateListingDialog}
        onOpenChange={setShowCreateListingDialog}
      >
        <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <CreateListingForm
            defaultValues={{
              title: searchResult?.title || "",
              area: searchResult?.area || "",
              lat: searchResult?.lat,
              lng: searchResult?.lng,
              googlePlaceId: searchResult?.googlePlaceId,
            }}
            onSuccess={() => {
              setShowCreateListingDialog(false);
              setSearchResult(null);
            }}
            onCancel={() => setShowCreateListingDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCreateAnchorDialog}
        onOpenChange={setShowCreateAnchorDialog}
      >
        <DialogContent className="max-w-md max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAnchor ? "Edit Anchor" : "Add Anchor"}
            </DialogTitle>
          </DialogHeader>
          <CreateAnchorForm
            defaultValues={{
              title: searchResult?.title || "",
              lat: searchResult?.lat,
              lng: searchResult?.lng,
              googlePlaceId: searchResult?.googlePlaceId,
              address: searchResult?.area,
            }}
            anchorToEdit={selectedAnchor || undefined}
            onSuccess={() => {
              setShowCreateAnchorDialog(false);
              setSelectedAnchor(null);
              setSearchResult(null);
            }}
            onCancel={() => {
              setShowCreateAnchorDialog(false);
              setSelectedAnchor(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AnchorPanel
        open={showAnchorPanel}
        onClose={() => setShowAnchorPanel(false)}
        onAnchorSelect={handleAnchorSelect}
      />
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

function AnchorInfoWindow({
  anchor,
  onEdit,
  onDelete,
}: {
  anchor: Anchor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = anchor.color || ANCHOR_COLORS[anchor.type];

  return (
    <div className="text-sm min-w-[180px] max-w-[240px] space-y-2">
      <h3 className="font-semibold leading-snug">{anchor.title}</h3>
      <div className="flex items-center gap-2 text-xs">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
          style={{
            backgroundColor: color + "20",
            color: color,
          }}
        >
          {anchor.type.replace("_", " ")}
        </span>
      </div>
      {anchor.address && (
        <p className="text-xs text-muted-foreground">{anchor.address}</p>
      )}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onEdit}
          className="text-xs text-primary hover:underline font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-destructive hover:underline font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
