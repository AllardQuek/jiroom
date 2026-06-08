"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  listingSchema,
  type ListingFormData,
} from "@/lib/schemas/listingSchema";
import { useListingStore } from "@/store/listingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Globe, MapPin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import PlaceAutocomplete from "@/components/map/PlaceAutocomplete";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const extractFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    let platform = "";
    let title = "";

    const hostname = urlObj.hostname.toLowerCase();

    // Platform detection
    if (hostname.includes("propertyguru")) platform = "PropertyGuru";
    else if (hostname.includes("99.co")) platform = "99.co";
    else if (hostname.includes("carousell")) platform = "Carousell";
    else if (hostname.includes("ohmyhome")) platform = "Ohmyhome";
    else if (hostname.includes("facebook")) platform = "FB Marketplace";
    else platform = hostname.replace("www.", "").split(".")[0];

    // Title and Price extraction from slug
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "";
    const parts = lastPart.split(/[-_]/);

    // 1. Identify "Type" keywords (HDB for Rent, etc)
    const typeMatch = lastPart.match(
      /^(hdb|condo|apartment|landed|room|studio)(?:-for)?(?:-rent|-sale)?/i
    );
    const typePrefix = typeMatch ? typeMatch[0].replace(/-/g, " ") : "";

    // 2. Try to find an address-like pattern (Number + Name)
    const addressMatch = lastPart.match(
      /(\d+-[a-zA-Z0-9-]*-(?:street|st|road|rd|avenue|ave|lane|ln|drive|dr|way|crescent|cres|walk|place|pl|grove|grv|link|view|heights|sq|square|way)[-a-zA-Z0-9-]*)/i
    );

    let addressPart = "";
    if (addressMatch) {
      addressPart = addressMatch[0]
        .split(/[-_]/)
        .filter((part) => !part.match(/^\d{8,}$/)) // remove long numeric IDs at the end
        .join(" ");
    }

    if (typePrefix || addressPart) {
      const combined = `${typePrefix} ${addressPart}`.trim();
      title = combined
        .split(/\s+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    } else {
      // 3. Fallback to general slug cleanup
      title = parts
        .filter((part) => !part.match(/^\d+$/)) // remove numeric IDs
        .filter(
          (part) =>
            !["hdb", "condo", "apartment", "rent", "for"].includes(
              part.toLowerCase()
            )
        ) // remove generic rent words
        .filter((part) => part.length > 2)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    return { platform, title };
  } catch {
    return { platform: "", title: "" };
  }
};

export function CreateListingForm({
  onSuccess,
  onCancel,
}: CreateListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addListing = useListingStore((state) => state.addListing);
  const listings = useListingStore((state) => state.listings);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      source_url: "",
      title: "",
      price: 0,
      area: "",
      source_platform: "",
      status: "to_view",
    },
  });

  const sourceUrl = useWatch({
    control: form.control,
    name: "source_url",
  });
  const currentTitle = useWatch({
    control: form.control,
    name: "title",
  });

  const isDuplicateUrl = listings.some(
    (l) => l.source_url === sourceUrl && sourceUrl !== ""
  );
  const isDuplicateTitle = listings.some(
    (l) =>
      l.title.toLowerCase() === currentTitle.toLowerCase() &&
      currentTitle !== ""
  );

  // Auto-fill effect
  useEffect(() => {
    if (sourceUrl && sourceUrl.startsWith("http")) {
      const { platform, title } = extractFromUrl(sourceUrl);

      // Only set if field is currently empty to avoid overwriting user edits
      if (platform && !form.getValues("source_platform")) {
        form.setValue("source_platform", platform);
      }
      if (title && !form.getValues("title")) {
        form.setValue("title", title);
      }
    }
  }, [sourceUrl, form]);

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    try {
      const newListing = {
        id: crypto.randomUUID(),
        ...data,
        source_platform: data.source_platform || "",
        area: data.area || "",
        created_at: new Date().toISOString(),
      };
      addListing(newListing);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="source_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  Listing URL
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste link from PropertyGuru, 99.co, etc."
                    className="bg-primary/5 border-primary/20 focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll try to auto-fill details from the link
                </FormDescription>
                {isDuplicateUrl && (
                  <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    This URL is already in your listings
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold flex items-center gap-1">
                <Sparkles
                  size={12}
                  className="text-yellow-500 fill-yellow-500"
                />
                Refined Details
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Title / Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 252 Tampines St 21" {...field} />
                  </FormControl>
                  {isDuplicateTitle && !isDuplicateUrl && (
                    <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Another listing has this exact title
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  Location
                </span>
              </label>
              <PlaceAutocomplete
                onPlaceSelect={(place) => {
                  form.setValue("title", place.title);
                  form.setValue("area", place.area);
                  form.setValue("lat", place.lat);
                  form.setValue("lng", place.lng);
                  form.setValue("googlePlaceId", place.googlePlaceId);
                }}
                placeholder="Search address or building name..."
                className="bg-primary/5 border border-primary/20 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-lg px-3 py-2 w-full text-sm outline-none transition-colors placeholder:text-muted-foreground/50"
              />
              <p className="text-[0.8rem] text-muted-foreground mt-1.5">
                Search to auto-fill location details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-detected..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <input type="hidden" {...form.register("area")} />
          </div>
        </div>

        <div className="flex flex-row-reverse gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 font-bold"
          >
            {isSubmitting ? "Saving..." : "Add to My Workspace"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
