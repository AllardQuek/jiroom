"use client";

import { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";
import { cleanTitle } from "@/lib/data/migrations";

interface PlaceResult {
  displayText: string;
  lat: number;
  lng: number;
  googlePlaceId: string;
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceResult) => void;
  initialValue?: string;
  placeId?: string;
  className?: string;
}

export default function PlaceAutocomplete({
  onPlaceSelect,
  initialValue,
  placeId,
  className,
}: PlaceAutocompleteProps) {
  const [value, setValue] = useState(initialValue || "");
  const [suggestions, setSuggestions] = useState<
    Array<{ text: string; placePrediction?: object }>
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const placesLib = useMapsLibrary("places");
  const onPlaceSelectRef = useRef(onPlaceSelect);
  onPlaceSelectRef.current = onPlaceSelect;

  const sessionTokenRef = useRef<unknown>(null);
  const justSelectedRef = useRef(false);

  useEffect(() => {
    if (!placesLib || !placeId) return;
    const lib = placesLib as unknown as Record<string, unknown>;
    const PlaceCtor = lib.Place as new (opts: { id: string }) => {
      fetchFields: (opts: { fields: string[] }) => Promise<void>;
      formattedAddress?: string;
    };
    if (typeof PlaceCtor !== "function") return;
    const place = new PlaceCtor({ id: placeId });
    place.fetchFields({ fields: ["formattedAddress"] }).then(() => {
      if (place.formattedAddress) setAddress(place.formattedAddress);
    });
  }, [placesLib, placeId]);

  useEffect(() => {
    if (!placesLib) return;
    console.log("[PlaceAutocomplete] placesLib available, keys:", Object.keys(placesLib as object));
    const lib = placesLib as unknown as Record<string, unknown>;
    const SessionTokenCtor = lib.AutocompleteSessionToken as new () => unknown;
    if (typeof SessionTokenCtor === "function") {
      sessionTokenRef.current = new SessionTokenCtor();
      console.log("[PlaceAutocomplete] SessionToken created");
    }
  }, [placesLib]);

  async function fetchSuggestions(query: string) {
    if (!placesLib || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const lib = placesLib as unknown as {
        AutocompleteSuggestion?: {
          fetchAutocompleteSuggestions: (
            opts: Record<string, unknown>
          ) => Promise<{ suggestions: Array<Record<string, unknown>> }>;
        };
      };
      const fetchFn = lib.AutocompleteSuggestion?.fetchAutocompleteSuggestions;
      if (!fetchFn) {
        console.log("[PlaceAutocomplete] fetchAutocompleteSuggestions not available");
        setSuggestions([]);
        return;
      }

      console.log("[PlaceAutocomplete] fetching suggestions for:", query);
      const result = await fetchFn({
        input: query,
        region: "SG",
        language: "en",
        ...(sessionTokenRef.current
          ? { sessionToken: sessionTokenRef.current }
          : {}),
      });
      console.log("[PlaceAutocomplete] suggestions result:", result);

      const items = (result.suggestions || []).map((s: Record<string, unknown>) => ({
        text: (s.placePrediction as Record<string, unknown>)?.text
          ? ((s.placePrediction as Record<string, unknown>).text as Record<string, unknown>).text as string
          : (s.queryPrediction as Record<string, unknown>)?.text
            ? ((s.queryPrediction as Record<string, unknown>).text as Record<string, unknown>).text as string
            : "",
        placePrediction: s.placePrediction as object | undefined,
      })).filter((s: { text: string }) => s.text);

      setSuggestions(items);
      setShowDropdown(items.length > 0);
    } catch (err) {
      console.error("[PlaceAutocomplete] fetchSuggestions error:", err);
      setSuggestions([]);
    }
  }

  function handleChange(value: string) {
    setValue(value);
    setShowDropdown(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  }

  async function handleSelect(suggestion: { text: string; placePrediction?: object }) {
    console.log("[PlaceAutocomplete] handleSelect:", suggestion.text);
    if (!placesLib || !suggestion.placePrediction) return;

    const cleanedText = cleanTitle(suggestion.text);
    justSelectedRef.current = true;
    setValue(cleanedText);
    setShowDropdown(false);

    interface SuggestionWithToPlace {
      toPlace: () => {
        fetchFields: (opts: { fields: string[] }) => Promise<void>;
        displayName?: { text?: string; languageCode?: string } | string;
        formattedAddress?: string;
        location?: google.maps.LatLng | null;
        addressComponents?: Array<{
          longText: string;
          shortText: string;
          types: string[];
        }>;
        id?: string;
      };
    }

    const place = (suggestion.placePrediction as SuggestionWithToPlace).toPlace();
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
    if (!location) {
      console.warn("[PlaceAutocomplete] no location in selected place");
      return;
    }

    const displayText = cleanTitle(suggestion.text);

    if (sessionTokenRef.current && placesLib) {
      const lib = placesLib as unknown as Record<string, unknown>;
      const SessionTokenCtor =
        lib.AutocompleteSessionToken as new () => unknown;
      if (typeof SessionTokenCtor === "function") {
        sessionTokenRef.current = new SessionTokenCtor();
      }
    }

    console.log("[PlaceAutocomplete] selected place:", { displayText, lat: location.lat(), lng: location.lng() });
    onPlaceSelectRef.current({
      displayText,
      lat: location.lat(),
      lng: location.lng(),
      googlePlaceId: place.id || "",
    });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative">
      {address && (
        <p className="text-xs text-muted-foreground mb-1">Address: {address}</p>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setShowDropdown(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            if (justSelectedRef.current) {
              justSelectedRef.current = false;
              return;
            }
            if (value) {
              onPlaceSelectRef.current({
                displayText: value,
                lat: 0,
                lng: 0,
                googlePlaceId: "",
              });
            }
          }, 200);
        }}
        placeholder="Type an address..."
        className={className}
      />
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.text + i}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
