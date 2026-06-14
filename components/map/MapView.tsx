"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useListingStore } from "@/store/listingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useAnchorStore } from "@/store/anchorStore";
import { useVerdictStore } from "@/store/verdictStore";
import { calculateScore } from "@/lib/utils/calculateScore";
import { ANCHOR_COLORS } from "@/lib/constants/ANCHOR_COLORS";
import { Listing } from "@/types/listing";
import { Anchor } from "@/types/anchor";
import { MapFilters, type Filters } from "./MapFilters";
import { MapTooltip } from "./MapTooltip";
import { MarkerColorToggle } from "./MarkerColorToggle";
import type { ColorMode } from "./MarkerColorToggle";
import { RoutePolyline } from "./RoutePolyline";
import { TravelModeToggle } from "./TravelModeToggle";
import { CommuteInfo, type RouteData } from "@/components/distance/CommuteInfo";
import { useRoutePrefsStore } from "@/store/routePrefsStore";
import {
  getCachedRoute,
  setCachedRoute,
  type RouteResultData,
} from "@/lib/utils/routeCache";
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
import { Plus, MapPin, List, AlertCircle, X, ExternalLink, Eye } from "lucide-react";
import dynamic from "next/dynamic";

const LocationSearch = dynamic(() => import("./LocationSearch"), {
  ssr: false,
});

const STATUS_COLORS: Record<string, string> = {
  new: "#9CA3AF",
  to_view: "#3B82F6",
  viewed: "#F59E0B",
  archived: "#D1D5DB",
};

const AREA_PALETTE = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#6366F1",
  "#14B8A6",
  "#A855F7",
];

function parseDurationToMinutes(text: string): number | null {
  const parts = text.match(/(\d+)\s*(hour|hr|h|min|mins?)/gi);
  if (!parts) return null;
  let total = 0;
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower.includes("hour") || lower.includes("hr") || lower === "h") {
      const num = parseInt(part, 10);
      if (!isNaN(num)) total += num * 60;
    } else if (lower.includes("min")) {
      const num = parseInt(part, 10);
      if (!isNaN(num)) total += num;
    }
  }
  return total || null;
}

interface MapViewProps {
  onViewDetails?: (listingId: string) => void;
}

interface SearchResult {
  displayText: string;
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
    areas: [],
    scoreMin: null,
    scoreMax: null,
    verdict: [],
  });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showCreateListingDialog, setShowCreateListingDialog] = useState(false);
  const [showCreateAnchorDialog, setShowCreateAnchorDialog] = useState(false);
  const [dismissNoCoords, setDismissNoCoords] = useState(false);
  const [showAnchorPanel, setShowAnchorPanel] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<{
    listing: Listing;
    x: number;
    y: number;
  } | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchDevice = useMemo(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    []
  );
  const [colorMode, setColorMode] = useState<ColorMode>("status");
  const visibleAnchors = useMemo(
    () => (filters.showAnchors ? anchors : []),
    [filters.showAnchors, anchors]
  );
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const verdicts = useVerdictStore((state) => state.verdicts);
  const templates = useTemplateStore((state) => state.templates);
  const template = templates[0];

  const areaOptions = useMemo(
    () => [...new Set(listings.map((l) => l.area).filter(Boolean))] as string[],
    [listings]
  );
  const areaColorMap = useMemo(() => {
    const uniqueAreas = [
      ...new Set(listings.map((l) => l.area).filter(Boolean)),
    ] as string[];
    const map: Record<string, string> = {};
    uniqueAreas.forEach((area, i) => {
      map[area] = AREA_PALETTE[i % AREA_PALETTE.length];
    });
    return map;
  }, [listings]);

  const travelMode = useRoutePrefsStore((s) => s.travelMode);
  const setTravelMode = useRoutePrefsStore((s) => s.setTravelMode);
  const filterAnchorId = useRoutePrefsStore((s) => s.filterAnchorId);
  const maxCommuteMinutes = useRoutePrefsStore((s) => s.maxCommuteMinutes);
  const routesLib = useMapsLibrary("routes");
  const [routeResults, setRouteResults] = useState<Record<string, RouteData>>(
    {}
  );

  useEffect(() => {
    if (
      !selectedListing ||
      !selectedListing.lat ||
      !selectedListing.lng ||
      !routesLib ||
      visibleAnchors.length === 0
    ) {
      return;
    }

    const targets = visibleAnchors;
    const listing = selectedListing;
    const RouteClass = (
      routesLib as unknown as { Route: typeof google.maps.routes.Route }
    ).Route;

    const initial: Record<string, RouteData> = {};
    targets.forEach((a) => {
      initial[a.id] = { result: null, error: null, loading: true };
    });
    setRouteResults(initial);

    targets.forEach(async (anchor) => {
      const originKey = `${listing.lat},${listing.lng}`;
      const destKey = `${anchor.lat},${anchor.lng}`;

      const cached = getCachedRoute(originKey, destKey, travelMode);
      if (cached) {
        initial[anchor.id] = { result: cached, error: null, loading: false };
        setRouteResults({ ...initial });
        return;
      }

      try {
        const { routes } = await RouteClass.computeRoutes({
          origin: { lat: listing.lat!, lng: listing.lng! },
          destination: { lat: anchor.lat, lng: anchor.lng },
          travelMode: travelMode as google.maps.TravelMode,
          departureTime: travelMode === "TRANSIT" ? new Date() : undefined,
          fields: ["path", "legs"],
        });

        const route = routes?.[0];
        if (!route) throw new Error("No route");

        const routeData: RouteResultData = {
          path: route.path ?? [],
          durationText: route.legs?.[0]?.localizedValues?.duration ?? "",
        };

        setCachedRoute(originKey, destKey, travelMode, routeData);
        initial[anchor.id] = {
          result: routeData,
          error: null,
          loading: false,
        };
      } catch {
        initial[anchor.id] = {
          result: null,
          error: "No route",
          loading: false,
        };
      }
      setRouteResults({ ...initial });
    });
  }, [selectedListing, travelMode, visibleAnchors, routesLib]);

  const handleMouseEnter = useCallback((listing: Listing, e: Event) => {
    const mouseEvent = e as MouseEvent;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMarker({
        listing,
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      });
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMarker(null);
  }, []);

  const listingsWithoutCoords = listings.filter((l) => !l.lat || !l.lng);

  const filteredListings = listings.filter((l) => {
    if (!l.lat || !l.lng) return false;
    if (filters.status.length > 0 && !filters.status.includes(l.status))
      return false;
    if (filters.priceMin !== null && l.price < filters.priceMin) return false;
    if (filters.priceMax !== null && l.price > filters.priceMax) return false;
    if (
      filters.areas.length > 0 &&
      (!l.area || !filters.areas.includes(l.area))
    )
      return false;

    if (filters.scoreMin !== null || filters.scoreMax !== null) {
      const evaluation = evaluations.find((e) => e.listing_id === l.id);
      const scoreNet =
        evaluation && template
          ? calculateScore(evaluation.responses, template)?.net ?? null
          : null;

      if (
        filters.scoreMin !== null &&
        (scoreNet === null || scoreNet < filters.scoreMin)
      )
        return false;
      if (
        filters.scoreMax !== null &&
        (scoreNet === null || scoreNet > filters.scoreMax)
      )
        return false;
    }

    if (filterAnchorId && maxCommuteMinutes !== null && l.lat && l.lng) {
      const filterAnchor = anchors.find((a) => a.id === filterAnchorId);
      if (filterAnchor) {
        const key = `${l.lat},${l.lng}`;
        const destKey = `${filterAnchor.lat},${filterAnchor.lng}`;
        const cached = getCachedRoute(key, destKey, travelMode);
        const durationText = cached?.durationText;
        if (durationText) {
          const minutes = parseDurationToMinutes(durationText);
          if (minutes !== null && minutes > maxCommuteMinutes) return false;
        }
      }
    }

    if (filters.verdict.length > 0) {
      const verdict = verdicts.find((v) => v.listing_id === l.id);
      const verdictStatus = verdict?.status;
      if (!verdictStatus || !filters.verdict.includes(verdictStatus))
        return false;
    }

    return true;
  });

  const handlePlaceSelect = useCallback((place: SearchResult) => {
    setSelectedListing(null);
    setSelectedAnchor(null);
    setSearchResult(place);
  }, []);

  const handleAnchorSelect = useCallback((anchor: Anchor) => {
    setSelectedAnchor(anchor);
    setSelectedListing(null);
    setShowAnchorPanel(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <style>{`.gm-ui-hover-effect { display: none !important; }`}</style>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <LocationSearch onPlaceSelect={handlePlaceSelect} />
      </div>
      {listingsWithoutCoords.length > 0 && !dismissNoCoords && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-xs text-amber-800 dark:text-amber-200 shadow-sm">
            <AlertCircle size={14} className="shrink-0" />
            <span className="flex-1">
              {listingsWithoutCoords.length} listing{listingsWithoutCoords.length > 1 ? "s" : ""} without map coordinates — edit to add a location
            </span>
            <button
              type="button"
              onClick={() => setDismissNoCoords(true)}
              className="shrink-0 hover:text-amber-900 dark:hover:text-amber-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      <MapFilters
        filters={filters}
        onFiltersChange={setFilters}
        colorMode={colorMode}
        areaColors={areaColorMap}
        areaOptions={areaOptions}
      />
      <div className="absolute top-3 right-16 z-10 flex items-center gap-1.5">
        <MarkerColorToggle mode={colorMode} onChange={setColorMode} />
        <TravelModeToggle mode={travelMode} onChange={setTravelMode} />
        <button
          onClick={() => setShowAnchorPanel(true)}
          className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:bg-background transition-colors"
        >
          <List size={14} />
          Anchors
        </button>
      </div>
      <Map
        defaultCenter={{ lat: 1.3521, lng: 103.8198 }}
        defaultZoom={12}
        mapId="DEMO_MAP_ID"
        className="w-full h-full"
        disableDefaultUI={false}
        onClick={() => {
          setSelectedListing(null);
          setSelectedAnchor(null);
          setRouteResults({});
        }}
      >
        {filteredListings.map((listing) => (
          <AdvancedMarker
            key={listing.id}
            position={{ lat: listing.lat!, lng: listing.lng! }}
            onClick={() => {
              setSelectedListing(listing);
              setSelectedAnchor(null);
              setHoveredMarker(null);
            }}
            onMouseEnter={
              !isTouchDevice ? (e) => handleMouseEnter(listing, e) : undefined
            }
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
          >
            <Pin
              background={
                colorMode === "area"
                  ? areaColorMap[listing.area] || "#6B7280"
                  : STATUS_COLORS[listing.status] || "#9CA3AF"
              }
              borderColor="#374151"
              glyphColor="#FFFFFF"
              scale={1.2}
            />
          </AdvancedMarker>
        ))}

        {selectedListing &&
          visibleAnchors.map((anchor) => {
            const data = routeResults[anchor.id];
            if (!data?.result) return null;
            const color = anchor.color || ANCHOR_COLORS[anchor.type];
            const duration = data.result.durationText;
            return (
              <RoutePolyline
                key={anchor.id}
                data={data.result}
                color={color}
                label={duration}
              />
            );
          })}

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
            <div>
              <ListingPreviewCard
                listing={selectedListing}
                onViewDetails={onViewDetails}
              />
              <CommuteInfo
                anchors={visibleAnchors}
                routes={routeResults}
                travelModeLabel={
                  travelMode === "TRANSIT"
                    ? "Transit"
                    : travelMode === "DRIVING"
                      ? "Driving"
                      : travelMode === "WALKING"
                        ? "Walking"
                        : "Biking"
                }
              />
            </div>
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
            <div>
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
            </div>
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
              title: searchResult?.displayText || "",
              area: searchResult?.displayText || "",
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
              title: searchResult?.displayText || "",
              lat: searchResult?.lat,
              lng: searchResult?.lng,
              googlePlaceId: searchResult?.googlePlaceId,
              address: searchResult?.displayText || "",
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

      {hoveredMarker && (
        <MapTooltip
          listing={hoveredMarker.listing}
          x={hoveredMarker.x}
          y={hoveredMarker.y}
        />
      )}

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
    <div className="text-sm min-w-[200px] max-w-[260px] pr-3">
      <div className="space-y-1.5">
        <h3 className="font-semibold leading-tight text-[13px]" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>{listing.title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-base">
            ${listing.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-[11px]">/mo</span>
        </div>
        {listing.area && (
          <p className="text-[11px] text-muted-foreground">{listing.area}</p>
        )}
        <div className="flex items-center gap-2">
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: STATUS_COLORS[listing.status] + "20",
              color: STATUS_COLORS[listing.status],
            }}
          >
            {listing.status.replace("_", " ")}
          </span>
          {score !== null && (
            <span className={`text-xs font-semibold tabular-nums ${
              score.net > 0 ? "text-emerald-600" : score.net < 0 ? "text-red-600" : ""
            }`}>
              {score.net > 0 ? `+${score.net}` : score.net}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 pb-2 border-t border-border/40">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(listing.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Eye size={12} />
            Details
          </button>
        )}
        <a
          href={listing.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <ExternalLink size={12} />
          Source
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <MapPin size={12} />
          Maps
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
    <div className="text-sm" style={{ minWidth: 180, maxWidth: 280 }}>
      <h3 className="font-semibold leading-tight text-[13px] break-words">{anchor.title}</h3>
      <div className="flex items-center gap-2 mt-1.5">
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: color + "20",
            color: color,
          }}
        >
          {anchor.type.replace("_", " ")}
        </span>
      </div>
      {anchor.address && (
        <p className="text-[11px] text-muted-foreground mt-1">{anchor.address}</p>
      )}
      <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-border/40">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
