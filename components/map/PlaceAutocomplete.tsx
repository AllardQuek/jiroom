"use client";

import { useRef, useEffect, useState } from "react";
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
  initialValue?: string;
  className?: string;
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

function formatAreaFromComponents(components: AddressComponent[]): string {
  const preferred = ["sublocality", "locality", "administrative_area_level_1"];
  for (const key of preferred) {
    const comp = components.find((c) => c.types.includes(key));
    if (comp) return comp.longText;
  }
  return "";
}

export default function PlaceAutocomplete({
  onPlaceSelect,
  initialValue,
  className,
}: PlaceAutocompleteProps) {
  const [value, setValue] = useState(initialValue || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !containerRef.current) return;

    const lib = placesLib as unknown as Record<string, unknown>;
    const Ctor = lib.PlaceAutocompleteElement;

    if (typeof Ctor !== "function") return;

    const PlaceAutocompleteElement = Ctor as new (
      options: Record<string, unknown>
    ) => HTMLElement & {
      addEventListener: (type: string, handler: EventListener) => void;
      removeEventListener: (type: string, handler: EventListener) => void;
    };

    try {
      const autocomplete = new PlaceAutocompleteElement({
        componentRestrictions: { country: "SG" },
        type: "address",
      });

      containerRef.current.appendChild(autocomplete);

      if (inputRef.current) {
        inputRef.current.style.display = "none";
      }

      interface GmpSelectEvent extends Event {
        placePrediction?: {
          toPlace: () => {
            fetchFields: (opts: { fields: string[] }) => Promise<void>;
            displayName?: { text?: string; languageCode?: string } | string;
            formattedAddress?: string;
            location?: google.maps.LatLng | null;
            addressComponents?: AddressComponent[];
            id?: string;
          };
        };
      }

      const handler = async (event: Event) => {
        const gmpEvent = event as GmpSelectEvent;
        const placePrediction = gmpEvent.placePrediction;
        if (!placePrediction) return;

        const place = placePrediction.toPlace();
        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "addressComponents",
            "id",
          ],
        });

        const location = place.location;
        if (!location) return;

        const displayName = place.displayName;
        const title =
          typeof displayName === "object" && displayName?.text
            ? displayName.text
            : place.formattedAddress || "";

        setValue(title);
        onPlaceSelect({
          title,
          area: formatAreaFromComponents(place.addressComponents || []),
          lat: location.lat(),
          lng: location.lng(),
          googlePlaceId: place.id || "",
        });
      };

      autocomplete.addEventListener("gmp-select", handler);

      const container = containerRef.current;
      return () => {
        autocomplete.removeEventListener("gmp-select", handler);
        if (autocomplete.parentNode === container) {
          container.removeChild(autocomplete);
        }
      };
    } catch {
      /* PlaceAutocompleteElement not supported by this key */
    }
  }, [placesLib, onPlaceSelect]);

  return (
    <div>
      {initialValue && (
        <p className="text-xs text-muted-foreground mb-1">
          Current: {initialValue}
        </p>
      )}
      <div ref={containerRef} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onPlaceSelect({
            title: e.target.value,
            area: e.target.value,
            lat: 0,
            lng: 0,
            googlePlaceId: "",
          });
        }}
        placeholder="Type an address..."
        className={className}
      />
    </div>
  );
}
