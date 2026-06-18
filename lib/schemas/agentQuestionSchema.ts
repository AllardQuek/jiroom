import { z } from "zod";

export const agentQuestionTemplateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  questions: z.array(z.string()).min(1, "At least one question is required"),
  updated_at: z.string().optional(),
});

export const createAgentQuestionTemplateSchema = agentQuestionTemplateSchema.omit({
  id: true,
  updated_at: true,
});

export const updateAgentQuestionTemplateSchema = agentQuestionTemplateSchema
  .partial()
  .required({ id: true });

export type AgentQuestionTemplateFormData = z.infer<
  typeof createAgentQuestionTemplateSchema
>;
