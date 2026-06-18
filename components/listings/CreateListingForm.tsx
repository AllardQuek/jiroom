"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  listingSchema,
  type ListingFormData,
} from "@/lib/schemas/listingSchema";
import { useListingStore } from "@/store/listingStore";
import { useEvaluationStore } from "@/store/evaluationStore";
import { useTemplateStore } from "@/store/templateStore";
import { useViewingStore } from "@/store/viewingStore";
import { normalizeUrl, normalizeForComparison } from "@/lib/utils/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MapPin, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { InlineEvaluation } from "@/components/evaluation/InlineEvaluation";
import { ScheduleViewingForm } from "@/components/viewing/ScheduleViewingForm";
import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
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
import { CreatableSelect } from "@/components/listings/AreaSelect";

interface CreateListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: Partial<ListingFormData>;
}

const extractFromUrl = (url: string) => {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : "https://" + url;
    const urlObj = new URL(normalized);
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

export function PriceInput({
  field,
}: {
  field: {
    value: number | undefined;
    onChange: (v: number | undefined) => void;
    onBlur: () => void;
    ref: React.Ref<HTMLInputElement>;
    name: string;
  };
}) {
  const [text, setText] = useState(
    () => (field.value ? String(field.value) : "")
  );

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="0"
      value={text}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/\D/g, "");
        setText(cleaned);
        field.onChange(cleaned === "" ? undefined : Number(cleaned));
      }}
      onBlur={field.onBlur}
      ref={field.ref}
      name={field.name}
    />
  );
}

export function CreateListingForm({
  onSuccess,
  onCancel,
  defaultValues: defaultValuesProp,
}: CreateListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResponses, setEvalResponses] = useState<
    Record<string, number | string>
  >({});
  const [viewingDate, setViewingDate] = useState<string | undefined>(undefined);
  const addListing = useListingStore((state) => state.addListing);
  const addEvaluation = useEvaluationStore((state) => state.addEvaluation);
  const addViewing = useViewingStore((state) => state.addViewing);
  const templates = useTemplateStore((state) => state.templates);
  const initializeTemplates = useTemplateStore(
    (state) => state.initializeTemplates
  );
  const listings = useListingStore((state) => state.listings);

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const template = templates[0];

  const form = useForm<ListingFormData>({
    resolver: zodResolver(
      listingSchema
    ) as unknown as import("react-hook-form").Resolver<ListingFormData>,
    defaultValues: {
      source_url: "",
      title: "",
      price: 0,
      area: "",
      source_platform: "",
      notes: "",
      status: "to_view",
      ...defaultValuesProp,
    },
  });

  const sourceUrl = useWatch({
    control: form.control,
    name: "source_url",
  });

  const priceValue = useWatch({
    control: form.control,
    name: "price",
  });

  const isDuplicateUrl = sourceUrl
    ? listings.some((l) => {
        const normalizedExisting = normalizeForComparison(l.source_url);
        const normalizedInput = normalizeForComparison(sourceUrl);
        return normalizedExisting === normalizedInput && normalizedInput !== "";
      })
    : false;

  const areaOptions = [
    ...new Set(listings.map((l) => l.area).filter(Boolean)),
  ] as string[];
  const platformOptions = [
    ...new Set(listings.map((l) => l.source_platform).filter(Boolean)),
  ] as string[];

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

  const handleEvalResponse = (id: string, value: number | string) => {
    setEvalResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleEvalClear = (id: string) => {
    setEvalResponses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const evalAnsweredCount = template
    ? template.criteria.filter((c) => {
        if (c.type === "derived") {
          return (
            priceValue > 0 ||
            c.derivedFrom?.some((id) => {
              const v = evalResponses[id];
              return v !== undefined && v !== "";
            })
          );
        }
        const v = evalResponses[c.id];
        return v !== undefined && v !== "";
      }).length
    : 0;

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    try {
      const listingId = crypto.randomUUID();
      const newListing = {
        id: listingId,
        ...data,
        source_platform: data.source_platform || "",
        area: data.area || "",
        created_at: new Date().toISOString(),
      };
      addListing(newListing);

      if (template && evalAnsweredCount > 0) {
        const now = new Date().toISOString();
        addEvaluation({
          id: crypto.randomUUID(),
          listing_id: listingId,
          template_id: template.id,
          responses: evalResponses,
          created_at: now,
          updated_at: now,
        });
      }

      if (viewingDate) {
        const now = new Date().toISOString();
        addViewing({
          id: crypto.randomUUID(),
          listing_id: listingId,
          scheduled_date: viewingDate,
          created_at: now,
        });
      }

      form.reset();
      setEvalResponses({});
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
                    {...field}
                    onBlur={(e) => {
                      const normalized = normalizeUrl(e.target.value);
                      if (normalized !== e.target.value) {
                        field.onChange(normalized);
                      }
                      field.onBlur();
                    }}
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

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Auto-filled from URL" {...field} />
                </FormControl>
                <FormDescription>
                  Auto-filled from URL or location &mdash; edit to differentiate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  Location *
                </span>
              </label>
              <PlaceAutocomplete
                onPlaceSelect={(place) => {
                  form.setValue("title", place.displayText);
                  if (place.lat) {
                    form.setValue("lat", place.lat);
                    form.setValue("lng", place.lng);
                    form.setValue("googlePlaceId", place.googlePlaceId);
                  }
                }}
              />
              <p className="text-[0.8rem] text-muted-foreground mt-1.5">
                Sets the listing title and map coordinates from the selected place
              </p>
            </div>

            <div>
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      Area
                    </FormLabel>
                    <FormControl>
                      <CreatableSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={areaOptions}
                        placeholder="Select or type an area..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price ($)</FormLabel>
                    <FormControl>
                      <PriceInput field={field} />
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
                      <CreatableSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={platformOptions}
                        placeholder="Auto-detected..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText size={14} className="text-primary" />
                  Listing Notes
                </FormLabel>
                <FormControl>
                  <AutoResizeTextarea
                    placeholder="Add any general observations, contact details, or thoughts about this listing..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                Schedule Viewing <span className="text-muted-foreground font-normal ml-1">(optional)</span>
              </span>
              {viewingDate && (
                <span className="text-[11px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                  Set
                </span>
              )}
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <ScheduleViewingForm
              listingId=""
              isScheduled={!!viewingDate}
              scheduledDate={viewingDate}
              viewing={viewingDate ? { scheduled_date: viewingDate, id: "", listing_id: "", created_at: "" } : undefined}
              onCancel={() => setViewingDate(undefined)}
              onSubmit={(data) => {
                setViewingDate(data.scheduled_date);
              }}
            />
          </div>
        </div>

        {template && (
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Evaluation <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </span>
                {evalAnsweredCount > 0 && (
                  <span className="text-[11px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                    {evalAnsweredCount}
                  </span>
                )}
              </div>
              {evalAnsweredCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  {evalAnsweredCount}/{template.criteria.length}
                </div>
              )}
            </div>
            
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <InlineEvaluation
                responses={evalResponses}
                onResponse={handleEvalResponse}
                onClearResponse={handleEvalClear}
                listingPrice={priceValue > 0 ? priceValue : undefined}
              />
            </div>
          </div>
        )}

        <div className="flex flex-row-reverse gap-3 pt-6 sticky bottom-0 bg-background backdrop-blur-xl z-50 pb-6 shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl mx-[-16px] px-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 font-bold"
          >
            {isSubmitting ? "Saving..." : "Add Listing"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-muted/50 hover:bg-muted"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
