"use client";

import { Polyline, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { RouteResultData } from "@/lib/utils/routeCache";

interface RoutePolylineProps {
  data: RouteResultData;
  color: string;
  label?: string;
}

export function RoutePolyline({ data, color, label }: RoutePolylineProps) {
  const path = data.path.map((p) => ({
    lat: p.lat,
    lng: p.lng,
  }));

  if (path.length === 0) return null;

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
