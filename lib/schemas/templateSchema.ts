import { z } from "zod";

export const criterionTypeEnum = z.enum([
  "checkbox",
  "rating",
  "number",
  "text",
  "select",
]);

export const weightEnum = z.enum(["1", "2", "3"]);

export const criterionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  weight: z.coerce
    .number()
    .min(1, "Weight must be at least 1")
    .max(3, "Weight must be at most 3"),
  type: criterionTypeEnum,
  category: z.string().min(1, "Category is required"),
  options: z.array(z.string()).optional(),
});

export const templateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  criteria: z.array(criterionSchema),
  updated_at: z.string().optional(),
});

export const createTemplateSchema = templateSchema.omit({
  id: true,
  updated_at: true,
});

export const updateTemplateSchema = templateSchema
  .partial()
  .required({ id: true });

export const createCriterionSchema = criterionSchema.omit({ id: true });

export const updateCriterionSchema = criterionSchema
  .partial()
  .required({ id: true });

export type CriterionFormData = z.infer<typeof createCriterionSchema>;
export type TemplateFormData = z.infer<typeof createTemplateSchema>;
