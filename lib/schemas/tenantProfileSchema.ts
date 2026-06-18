import { z } from "zod";

export const tenantProfileSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  noOfPax: z.string().optional(),
  gender: z.string().optional(),
  pets: z.string().optional(),
  cooking: z.string().optional(),
  pass: z.string().optional(),
  workLocation: z.string().optional(),
  moveInDate: z.string().optional(),
  leaseDuration: z.string().optional(),
  budget: z.string().optional(),
  viewing: z.string().optional(),
});

export type TenantProfileFormData = z.infer<typeof tenantProfileSchema>;
