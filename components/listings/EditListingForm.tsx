"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  listingSchema,
  type ListingFormData,
} from "@/lib/schemas/listingSchema";
import { useListingStore } from "@/store/listingStore";
import { Listing } from "@/types/listing";
import { normalizeUrl } from "@/lib/utils/url";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { MapPin, XCircle } from "lucide-react";
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
  const t = useTranslations("listings");
  const tCommon = useTranslations("common");
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
    resolver: zodResolver(
      listingSchema
    ) as unknown as Resolver<ListingFormData>,
    defaultValues: {
      source_url: listing.source_url,
      title: listing.title,
      price: listing.price,
      negotiated_price: listing.negotiated_price,
      area: listing.area,
      source_platform: listing.source_platform,
      status: listing.status,
      lat: listing.lat,
      lng: listing.lng,
      googlePlaceId: listing.googlePlaceId,
      is_taken: listing.is_taken ?? false,
      taken_date: listing.taken_date,
    },
  });

  const isTaken = form.watch("is_taken");

  // Auto-set taken_date when is_taken is enabled
  useEffect(() => {
    if (isTaken && !form.getValues("taken_date")) {
      form.setValue("taken_date", new Date().toISOString());
    }
  }, [isTaken, form]);

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
              <FormLabel>{t("edit.sourceUrl")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("edit.sourceUrlPlaceholder")}
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
              <FormLabel>{t("edit.title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("edit.titlePlaceholder")} {...field} />
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
              <FormLabel>{t("edit.initialPriceRequired")}</FormLabel>
              <FormControl>
                <PriceInput field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="negotiated_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("edit.negotiatedPrice")}</FormLabel>
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
              {t("edit.locationRequired")}
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
            {t("edit.locationDescription")}
          </p>
        </div>

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                {t("edit.area")}
              </FormLabel>
              <FormControl>
                <CreatableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={areaOptions}
                  placeholder={t("edit.areaPlaceholder")}
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
              <FormLabel>{t("edit.platform")}</FormLabel>
              <FormControl>
                <CreatableSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={platformOptions}
                  placeholder={t("edit.platformPlaceholder")}
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
              <FormLabel>{t("edit.status")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("edit.statusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">{t("edit.statusNew")}</SelectItem>
                  <SelectItem value="to_view">
                    {t("edit.statusToView")}
                  </SelectItem>
                  <SelectItem value="viewed">
                    {t("edit.statusViewed")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <FormField
            control={form.control}
            name="is_taken"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between py-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-base flex items-center gap-2 cursor-pointer">
                    <XCircle size={16} className="text-muted-foreground" />
                    {t("edit.markAsTaken")}
                  </FormLabel>
                  <p className="text-[0.8rem] text-muted-foreground">
                    {t("edit.takenDescription")}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isTaken && (
            <FormField
              control={form.control}
              name="taken_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("edit.date")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("edit.datePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {tCommon("cancel")}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("edit.saving") : t("edit.saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
