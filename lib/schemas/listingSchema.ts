import { z } from "zod";

export const listingSchema = z.object({
  source_url: z.string().url("Please enter a valid URL"),
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  price: z.number().positive("Price must be a positive number"),
  area: z.string().optional(),
  source_platform: z.string().optional(),
  status: z.enum(["new", "to_view", "viewed", "archived", "shortlisted"]).default("new"),
});

export type ListingFormData = z.infer<typeof listingSchema>;
