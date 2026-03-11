import { z } from "zod";

export const preventiveAlertQuerySchema = z.object({
  neighborhood: z.string().trim().min(2).max(120),
});

export type PreventiveAlertQueryInput = z.infer<
  typeof preventiveAlertQuerySchema
>;
