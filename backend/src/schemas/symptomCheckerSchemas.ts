import { z } from "zod";

export const symptomCheckerBodySchema = z.object({
  fever: z.boolean().default(false),
  headache: z.boolean().default(false),
  painBehindEyes: z.boolean().default(false),
  bodyAches: z.boolean().default(false),
  jointPain: z.boolean().default(false),
  nausea: z.boolean().default(false),
  vomiting: z.boolean().default(false),
  rash: z.boolean().default(false),
  fatigue: z.boolean().default(false),
  abdominalPain: z.boolean().default(false),
  persistentVomiting: z.boolean().default(false),
  bleedingSigns: z.boolean().default(false),
  drowsiness: z.boolean().default(false),
  dehydrationSigns: z.boolean().default(false),
});

export type SymptomCheckerInput = z.infer<typeof symptomCheckerBodySchema>;
