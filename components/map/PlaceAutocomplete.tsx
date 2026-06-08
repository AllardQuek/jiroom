"use client";

import { useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface PlaceResult {
  title: string;
  area: string;
  lat: number;
  lng: number;
  googlePlaceId: string;
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

function formatAreaFromComponents(
  components: google.maps.GeocoderAddressComponent[]
): string {
  const preferred = ["sublocality", "locality", "administrative_area_level_1"];
  for (const key of preferred) {
    const comp = components.find((c) => c.types.includes(key));
    if (comp) return comp.long_name;
  }
  return "";
}

export default function PlaceAutocomplete({
  onPlaceSelect,
  placeholder = "Search for a location...",
  initialValue,
  className,
}: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: [
        "place_id",
        "geometry",
        "formatted_address",
        "address_components",
        "name",
      ],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      onPlaceSelect({
        title: place.name || place.formatted_address || "",
        area: formatAreaFromComponents(place.address_components || []),
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        googlePlaceId: place.place_id || "",
      });
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [placesLib, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      defaultValue={initialValue}
      className={className}
    />
  );
}
