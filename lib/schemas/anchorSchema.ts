import { z } from "zod";

export const anchorSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  customTypeLabel: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  googlePlaceId: z.string().optional(),
  address: z.string().optional(),
  color: z.string().optional(),
});

export type AnchorFormData = z.infer<typeof anchorSchema>;
