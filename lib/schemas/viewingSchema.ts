import { z } from "zod";

export const viewingSchema = z.object({
  id: z.string().min(1, "ID is required"),
  listing_id: z.string().min(1, "Listing ID is required"),
  scheduled_date: z.string().optional(),
  created_at: z.string().optional(),
});

export const createViewingSchema = viewingSchema.omit({
  id: true,
  created_at: true,
});

export const updateViewingSchema = viewingSchema
  .partial()
  .required({ id: true });

export type ViewingFormData = z.infer<typeof createViewingSchema>;
