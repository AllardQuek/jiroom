"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { anchorSchema, type AnchorFormData } from "@/lib/schemas/anchorSchema";
import { ANCHOR_COLORS, getAnchorColor } from "@/lib/constants/ANCHOR_COLORS";
import { getAnchorColorForType, CUSTOM_ANCHOR_PALETTE_EXPORT } from "@/lib/constants/colors";
import { useAnchorStore } from "@/store/anchorStore";
import { Anchor, AnchorType } from "@/types/anchor";
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
import PlaceAutocomplete from "@/components/map/PlaceAutocomplete";

const PREDEFINED_TYPES: { value: AnchorType; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "school", label: "School" },
  { value: "station", label: "MRT / Station" },
  { value: "custom", label: "Custom" },
];

interface CreateAnchorFormProps {
  onSuccess?: (anchor: Anchor) => void;
  onCancel?: () => void;
  defaultValues?: Partial<AnchorFormData>;
  anchorToEdit?: Anchor;
}

export function CreateAnchorForm({
  onSuccess,
  onCancel,
  defaultValues: defaultValuesProp,
  anchorToEdit,
}: CreateAnchorFormProps) {
  const addAnchor = useAnchorStore((state) => state.addAnchor);
  const updateAnchor = useAnchorStore((state) => state.updateAnchor);

  const form = useForm<AnchorFormData>({
    resolver: zodResolver(anchorSchema) as any,
    defaultValues: {
      title: "",
      type: "home",
      lat: 0,
      lng: 0,
      address: "",
      color: ANCHOR_COLORS.home,
      ...defaultValuesProp,
      ...(anchorToEdit
        ? {
            title: anchorToEdit.title,
            type: anchorToEdit.type,
            customTypeLabel: anchorToEdit.customTypeLabel,
            lat: anchorToEdit.lat,
            lng: anchorToEdit.lng,
            googlePlaceId: anchorToEdit.googlePlaceId,
            address: anchorToEdit.address,
            color: anchorToEdit.color,
          }
        : {}),
    },
  });

  const selectedType = form.watch("type");
  const selectedColor = form.watch("color");

  const onSubmit = async (data: AnchorFormData) => {
    if (anchorToEdit) {
      updateAnchor(anchorToEdit.id, data);
      onSuccess?.({ ...anchorToEdit, ...data });
    } else {
      const anchor: Anchor = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      addAnchor(anchor);
      onSuccess?.(anchor);
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. My Office, Home, Jurong East MRT"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        field.onChange(t.value);
                        // Auto-set color when type changes (if not custom)
                        if (t.value !== "custom") {
                          form.setValue("color", getAnchorColorForType(t.value));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        field.value === t.value
                          ? "border-transparent text-white"
                          : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                      style={
                        field.value === t.value
                          ? { backgroundColor: t.value === "custom" && selectedColor ? selectedColor : ANCHOR_COLORS[t.value] || getAnchorColorForType(t.value) }
                          : {}
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "custom" && (
          <FormField
            control={form.control}
            name="customTypeLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Type Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Gym, Parents' House"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedType === "custom" && (
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_ANCHOR_PALETTE_EXPORT.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              Location
            </span>
          </label>
          <PlaceAutocomplete
            onPlaceSelect={(place) => {
              form.setValue("title", place.displayText);
              form.setValue("address", place.displayText);
              if (place.lat) {
                form.setValue("lat", place.lat);
                form.setValue("lng", place.lng);
                form.setValue("googlePlaceId", place.googlePlaceId);
              }
            }}
            initialValue={anchorToEdit?.address}
            className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 w-full text-sm outline-none"
          />
          <p className="text-[0.8rem] text-muted-foreground mt-1.5">
            Search to set the anchor location
          </p>
        </div>

        <input type="hidden" {...form.register("lat")} />
        <input type="hidden" {...form.register("lng")} />

        <div className="flex flex-row-reverse gap-3 pt-4 border-t">
          <Button type="submit" className="flex-1 font-bold">
            {anchorToEdit ? "Save changes" : "Add anchor"}
          </Button>
          <Button
            type="button"
            variant="outline"
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
