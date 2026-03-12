import { z } from "zod";

export const symptomCheckerRequestSchema = z.object({
  fever: z.boolean(),
  headache: z.boolean(),
  painBehindEyes: z.boolean(),
  bodyAche: z.boolean(),
  jointPain: z.boolean(),
  nausea: z.boolean(),
  vomiting: z.boolean(),
  rash: z.boolean(),
  abdominalPain: z.boolean(),
  persistentVomiting: z.boolean(),
  bleeding: z.boolean(),
  dizzinessOrFainting: z.boolean(),
  breathingDifficulty: z.boolean(),
  extremeTirednessOrIrritability: z.boolean(),
  symptomDays: z.number().int().min(0).max(30).optional(),
});

export type SymptomCheckerRequestInput = z.infer<
  typeof symptomCheckerRequestSchema
>;
