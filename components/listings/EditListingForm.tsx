"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  listingSchema,
  type ListingFormData,
} from "@/lib/schemas/listingSchema";
import { useListingStore } from "@/store/listingStore";
import { Listing } from "@/types/listing";
import { normalizeUrl } from "@/lib/utils/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlaceAutocomplete from "@/components/map/PlaceAutocomplete";
import { CreatableSelect } from "@/components/listings/AreaSelect";
import { PriceInput } from "@/components/listings/PriceInput";

interface EditListingFormProps {
  listing: Listing;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditListingForm({
  listing,
  onSuccess,
  onCancel,
}: EditListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateListing = useListingStore((state) => state.updateListing);
  const listings = useListingStore((state) => state.listings);

  const areaOptions = [
    ...new Set(listings.map((l) => l.area).filter(Boolean)),
  ] as string[];
  const platformOptions = [
    ...new Set(listings.map((l) => l.source_platform).filter(Boolean)),
  ] as string[];

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      source_url: listing.source_url,
      title: listing.title,
      price: listing.price,
      area: listing.area,
      source_platform: listing.source_platform,
      status: listing.status,
      lat: listing.lat,
      lng: listing.lng,
      googlePlaceId: listing.googlePlaceId,
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true);
    try {
      updateListing(listing.id, data);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="source_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source URL *</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/listing"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Listing title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price *</FormLabel>
              <FormControl>
                <PriceInput field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            initialValue={listing.title}
            placeId={listing.googlePlaceId}
          />
          <p className="text-[0.8rem] text-muted-foreground mt-1.5">
            Updates the listing title and map coordinates from the selected
            place
          </p>
        </div>

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

        <FormField
          control={form.control}
          name="source_platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Platform</FormLabel>
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="to_view">To View</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
