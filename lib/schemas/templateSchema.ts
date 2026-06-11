import { z } from "zod";

export const criterionTypeEnum = z.enum([
  "checkbox",
  "rating",
  "number",
  "text",
  "select",
  "derived",
]);

const scoreValue = z.union([z.literal(-1), z.literal(0), z.literal(1)]);

const thresholdSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  score: scoreValue,
});

export const criterionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: criterionTypeEnum,
  category: z.string().min(1, "Category is required"),
  options: z.array(z.string()).optional(),
  scores: z.record(z.string(), scoreValue).optional(),
  thresholds: z.array(thresholdSchema).optional(),
  derivedFrom: z.array(z.string()).optional(),
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
