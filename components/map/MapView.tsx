"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
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
import { getCachedRoute } from "@/lib/utils/routeCache";
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
import {
  Plus,
  MapPin,
  List,
  AlertCircle,
  X,
  Menu,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ListingPreviewCard } from "./ListingPreviewCard";
import { AnchorInfoWindow } from "./AnchorInfoWindow";
import { MapController } from "./MapController";
import { useRouteCalculator } from "./hooks/useRouteCalculator";

const LocationSearch = dynamic(() => import("./LocationSearch"), {
  ssr: false,
});

const STATUS_COLORS: Record<string, string> = {
  new: "#9CA3AF",
  to_view: "#3B82F6",
  viewed: "#F59E0B",
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
  const [colorMode, setColorMode] = useState<ColorMode>("area");
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

  const routeResults = useRouteCalculator({
    selectedListing,
    visibleAnchors,
  });

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
          ? (calculateScore(evaluation.responses, template)?.net ?? null)
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

    if (filterAnchorId && maxCommuteMinutes !== null && travelMode && l.lat && l.lng) {
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

  useEffect(() => {
    if (!showMobileMenu) return;
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  return (
    <div className="relative w-full h-full">
      <style>{`.gm-ui-hover-effect { display: none !important; }`}</style>
      <div className="absolute top-16 sm:top-3 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <LocationSearch onPlaceSelect={handlePlaceSelect} />
      </div>
      {listingsWithoutCoords.length > 0 && !dismissNoCoords && (
        <div className="absolute max-sm:top-[60px] sm:top-16 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-xs text-amber-800 dark:text-amber-200 shadow-sm">
            <AlertCircle size={14} className="shrink-0" />
            <span className="flex-1">
              {listingsWithoutCoords.length} listing
              {listingsWithoutCoords.length > 1 ? "s" : ""} without map
              coordinates — edit to add a location
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
        areaColors={areaColorMap}
        areaOptions={areaOptions}
      />
      <div ref={mobileMenuRef} className="absolute top-3 right-16 sm:right-16 z-10">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-2.5 shadow-sm hover:bg-background transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu size={16} />
        </button>
        {showMobileMenu && (
          <div className="sm:hidden absolute right-0 top-full mt-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-md w-56 space-y-3">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Marker color</p>
              <MarkerColorToggle mode={colorMode} onChange={setColorMode} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">Route mode</p>
              <TravelModeToggle mode={travelMode} onChange={setTravelMode} />
            </div>
            <button
              onClick={() => { setSelectedListing(null); setShowAnchorPanel(true); setShowMobileMenu(false); }}
              className="w-full flex items-center justify-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:bg-background transition-colors"
            >
              <List size={14} />
              Anchors
            </button>
          </div>
        )}
        <div className="hidden sm:flex items-center gap-1.5">
          <MarkerColorToggle mode={colorMode} onChange={setColorMode} />
          <TravelModeToggle mode={travelMode} onChange={setTravelMode} />
          <button
            onClick={() => { setSelectedListing(null); setShowAnchorPanel(true); }}
            className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:bg-background transition-colors"
          >
            <List size={14} />
            Anchors
          </button>
        </div>
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
        }}
      >
          {filteredListings.map((listing) => {
            const isSelected = selectedListing?.id === listing.id;
            return (
            <AdvancedMarker
              key={listing.id}
              position={{ lat: listing.lat!, lng: listing.lng! }}
              onClick={() => {
                setSelectedListing(listing);
                setSelectedAnchor(null);
                setShowAnchorPanel(false);
                setHoveredMarker(null);
              }}
              onMouseEnter={
                !isTouchDevice ? (e) => handleMouseEnter(listing, e) : undefined
              }
              onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
            >
              {isSelected ? (
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full opacity-30"
                    style={{
                      backgroundColor: colorMode === "area"
                        ? areaColorMap[listing.area] || "#6B7280"
                        : STATUS_COLORS[listing.status] || "#9CA3AF",
                      width: 48,
                      height: 48,
                      left: -10,
                      top: -10,
                    }}
                  />
                  <Pin
                    background={
                      colorMode === "area"
                        ? areaColorMap[listing.area] || "#6B7280"
                        : STATUS_COLORS[listing.status] || "#9CA3AF"
                    }
                    borderColor="#000000"
                    glyphColor="#FFFFFF"
                    scale={1.6}
                  />
                </div>
              ) : (
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
              )}
            </AdvancedMarker>
            );
          })}

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
          <>
            <div
              className="fixed inset-0 z-30 sm:hidden"
              onClick={() => setSelectedListing(null)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.1)] max-h-[60dvh] flex flex-col animate-slide-up sm:bottom-auto sm:left-auto sm:top-14 sm:right-4 sm:w-96 sm:max-h-[calc(100dvh-6rem)] sm:rounded-2xl sm:shadow-xl sm:animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
                <h2 className="text-sm font-semibold">Listing Details</h2>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-1 -mr-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <ListingPreviewCard
                  listing={selectedListing}
                  onViewDetails={onViewDetails}
                />
                {visibleAnchors.some((a) => a.id in routeResults) && (
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
                            : travelMode === "BICYCLING"
                              ? "Biking"
                              : ""
                    }
                  />
                )}
              </div>
            </div>
          </>
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
        {selectedAnchor && (
          <MapController key={selectedAnchor.id} lat={selectedAnchor.lat} lng={selectedAnchor.lng} />
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
