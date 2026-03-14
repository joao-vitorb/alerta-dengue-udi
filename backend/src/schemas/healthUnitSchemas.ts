import { z } from "zod";

const healthUnitTypeSchema = z.enum([
  "UAI",
  "UBS",
  "UBSF",
  "HOSPITAL",
  "CAPS",
  "CER",
  "COV",
  "CMAD",
  "CEREST",
  "LABORATORY",
  "OTHER",
]);

const healthCareLevelSchema = z.enum([
  "PRIMARY_CARE",
  "URGENT_CARE",
  "SPECIALTY_CARE",
  "SUPPORT_SERVICE",
]);

const healthSectorSchema = z.enum([
  "CENTRAL",
  "EAST",
  "NORTH",
  "SOUTH",
  "WEST",
  "RURAL",
]);

export const healthUnitQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  unitType: healthUnitTypeSchema.optional(),
  careLevel: healthCareLevelSchema.optional(),
  sector: healthSectorSchema.optional(),
  neighborhood: z.string().trim().min(2).max(120).optional(),
});

export const recommendedHealthUnitQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  careLevel: healthCareLevelSchema.optional(),
  neighborhood: z.string().trim().min(2).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(10).default(3),
});

export const healthUnitIdParamSchema = z.object({
  healthUnitId: z.string().trim().min(1),
});

export type HealthUnitQueryInput = z.infer<typeof healthUnitQuerySchema>;
export type RecommendedHealthUnitQueryInput = z.infer<
  typeof recommendedHealthUnitQuerySchema
>;
