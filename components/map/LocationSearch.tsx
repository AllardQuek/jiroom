"use client";

import { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface LocationSearchResult {
  displayText: string;
  lat: number;
  lng: number;
  googlePlaceId: string;
}

interface LocationSearchProps {
  onPlaceSelect: (place: LocationSearchResult) => void;
}

interface Suggestion {
  placePrediction?: {
    text: { text: string };
    toPlace: () => {
      fetchFields: (opts: { fields: string[] }) => Promise<void>;
      displayName?: { text?: string } | string;
      formattedAddress?: string;
      location?: google.maps.LatLng | null;
      addressComponents?: Array<{
        longText: string;
        shortText: string;
        types: string[];
      }>;
      id?: string;
    };
  } | null;
  queryPrediction?: {
    text: { text: string };
  } | null;
}

export default function LocationSearch({ onPlaceSelect }: LocationSearchProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const placesLib = useMapsLibrary("places");

  const sessionTokenRef = useRef<unknown>(null);
  const callbackRef = useRef(onPlaceSelect);
  useEffect(() => {
    callbackRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    if (!placesLib) return;
    const lib = placesLib as unknown as Record<string, unknown>;
    const SessionTokenCtor = lib.AutocompleteSessionToken as new () => unknown;
    if (typeof SessionTokenCtor === "function") {
      sessionTokenRef.current = new SessionTokenCtor();
    }
  }, [placesLib]);

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
          ) => Promise<{ suggestions: Suggestion[] }>;
        };
      };
      const fetchFn = lib.AutocompleteSuggestion?.fetchAutocompleteSuggestions;

      if (!fetchFn) {
        setSuggestions([]);
        return;
      }

      const result = await fetchFn({
        input: query,
        region: "SG",
        language: "en",
        ...(sessionTokenRef.current
          ? { sessionToken: sessionTokenRef.current }
          : {}),
      });

      setSuggestions(result.suggestions || []);
      setShowDropdown(result.suggestions?.length > 0);
    } catch {
      setSuggestions([]);
    }
  }

  function handleChange(value: string) {
    setValue(value);
    setShowDropdown(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  }

  async function handleSelect(suggestion: Suggestion) {
    const displayText =
      suggestion.placePrediction?.text?.text ||
      suggestion.queryPrediction?.text?.text ||
      "";
    setValue(displayText);
    setShowDropdown(false);

    if (!suggestion.placePrediction) return;
    const place = suggestion.placePrediction.toPlace();
    await place.fetchFields({
      fields: [
        "displayName",
        "formattedAddress",
        "location",
        "addressComponents",
        "id",
      ],
    });

    const loc = place.location;
    if (!loc) return;

    if (sessionTokenRef.current && placesLib) {
      const lib = placesLib as unknown as Record<string, unknown>;
      const SessionTokenCtor =
        lib.AutocompleteSessionToken as new () => unknown;
      if (typeof SessionTokenCtor === "function") {
        sessionTokenRef.current = new SessionTokenCtor();
      }
    }

    callbackRef.current({
      displayText,
      lat: loc.lat(),
      lng: loc.lng(),
      googlePlaceId: place.id || "",
    });
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 min-h-[44px]">
        <svg
          className="h-4 w-4 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder="Search for a location..."
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          {suggestions.map((s, i) => {
            const text =
              s.placePrediction?.text?.text ||
              s.queryPrediction?.text?.text ||
              "";
            return (
              <button
                key={text + i}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
