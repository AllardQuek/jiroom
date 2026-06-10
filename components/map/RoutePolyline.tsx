"use client";

import { Polyline, AdvancedMarker } from "@vis.gl/react-google-maps";

interface RoutePolylineProps {
  result: google.maps.DirectionsResult;
  color: string;
  label?: string;
}

export function RoutePolyline({ result, color, label }: RoutePolylineProps) {
  const route = result.routes[0];
  if (!route) return null;

  const leg = route.legs[0];
  if (!leg) return null;

  const path = leg.steps.map((step) => ({
    lat: step.start_location.lat(),
    lng: step.start_location.lng(),
  }));
  path.push({
    lat: leg.end_location.lat(),
    lng: leg.end_location.lng(),
  });

  const midIndex = Math.floor(path.length / 2);
  const midPoint = path[midIndex];

  return (
    <>
      <Polyline
        path={path}
        strokeColor={color}
        strokeOpacity={0.55}
        strokeWeight={3.5}
      />
      {label && midPoint && (
        <AdvancedMarker position={midPoint} title={label}>
          <div
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shadow-sm border border-border/40"
            style={{
              backgroundColor: color + "20",
              color: color,
              borderColor: color + "40",
            }}
          >
            {label}
          </div>
        </AdvancedMarker>
      )}
    </>
  );
}
