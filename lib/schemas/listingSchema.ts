import { z } from "zod";
import { normalizeUrl } from "@/lib/utils/url";

const urlPreprocess = z.preprocess(
  (val) => (typeof val === "string" ? normalizeUrl(val) : val),
  z.string().url("Please enter a valid URL — make sure it starts with http:// or https://")
);

export const listingSchema = z.object({
  source_url: urlPreprocess,
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  price: z.number().positive("Price must be a positive number"),
  area: z.string().optional(),
  source_platform: z.string().optional(),
  status: z
    .enum(["new", "to_view", "viewed", "archived"])
    .default("new"),
  lat: z.number().optional(),
  lng: z.number().optional(),
  googlePlaceId: z.string().optional(),
  notes: z.string().optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
