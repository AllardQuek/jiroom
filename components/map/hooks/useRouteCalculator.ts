import { useState, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useRoutePrefsStore } from "@/store/routePrefsStore";
import { Listing } from "@/types/listing";
import { Anchor } from "@/types/anchor";
import { CommuteInfo, type RouteData } from "@/components/distance/CommuteInfo";
import {
  getCachedRoute,
  setCachedRoute,
  type RouteResultData,
} from "@/lib/utils/routeCache";

interface UseRouteCalculatorProps {
  selectedListing: Listing | null;
  visibleAnchors: Anchor[];
}

/**
 * Custom hook to calculate routes from a selected listing to visible anchors.
 * This hook uses the Google Maps Routes API to calculate travel times and routes,
 * with caching to avoid redundant API calls. It automatically recalculates when
 * the selected listing, visible anchors, or travel mode changes.
 *
 * @param selectedListing - The currently selected listing (origin for routes)
 * @param visibleAnchors - Array of anchors to calculate routes to (destinations)
 * @returns A record mapping anchor IDs to route data (result, error, loading state)
 *
 * @example
 * ```tsx
 * const routeResults = useRouteCalculator({
 *   selectedListing,
 *   visibleAnchors,
 * });
 *
 * Object.entries(routeResults).forEach(([anchorId, data]) => {
 *   if (data.result) {
 *     console.log(`Route to ${anchorId}: ${data.result.durationText}`);
 *   }
 * });
 * ```
 */
export function useRouteCalculator({
  selectedListing,
  visibleAnchors,
}: UseRouteCalculatorProps) {
  const [routeResults, setRouteResults] = useState<Record<string, RouteData>>(
    {}
  );
  const travelMode = useRoutePrefsStore((s) => s.travelMode);
  const routesLib = useMapsLibrary("routes");

  useEffect(() => {
    if (
      !selectedListing ||
      !selectedListing.lat ||
      !selectedListing.lng ||
      !travelMode ||
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
        setRouteResults((prev) => ({
          ...prev,
          [anchor.id]: { result: routeData, error: null, loading: false },
        }));
      } catch (err) {
        console.error("Route calculation error:", err);
        setRouteResults((prev) => ({
          ...prev,
          [anchor.id]: {
            result: null,
            error: (err as Error).message,
            loading: false,
          },
        }));
      }
    });
  }, [selectedListing, travelMode, routesLib, visibleAnchors]);

  return routeResults;
}
