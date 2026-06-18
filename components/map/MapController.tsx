import { useRef, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/**
 * Props for the MapController component
 */
interface MapControllerProps {
  lat: number;
  lng: number;
}

/**
 * A component that controls the Google Map view to pan to a specific location.
 * This component uses the useMap hook to access the map instance and
 * programmatically pan to the specified coordinates with a fixed zoom level.
 *
 * @param lat - The latitude to pan to
 * @param lng - The longitude to pan to
 * @returns A null component (this is a side-effect only component)
 *
 * @example
 * ```tsx
 * <Map>
 *   <MapController lat={1.3521} lng={103.8198} />
 * </Map>
 * ```
 */
export function MapController({ lat, lng }: MapControllerProps) {
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
