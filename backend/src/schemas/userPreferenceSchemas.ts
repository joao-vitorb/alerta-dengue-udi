import { z } from "zod";

const emailSchema = z
  .union([z.string().trim().email("Email must be valid"), z.literal("")])
  .transform((value) => (value === "" ? undefined : value));

const deviceTypeSchema = z.enum(["DESKTOP", "MOBILE"]);

export const anonymousIdParamSchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
});

export const createUserPreferenceSchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
  neighborhood: z.string().trim().min(2).max(120),
  email: emailSchema.optional(),
  notificationsEnabled: z.boolean(),
  emailNotificationsEnabled: z.boolean(),
  pushNotificationsEnabled: z.boolean(),
  deviceType: deviceTypeSchema,
});

export const updateUserPreferenceSchema = z
  .object({
    neighborhood: z.string().trim().min(2).max(120).optional(),
    email: emailSchema.optional(),
    notificationsEnabled: z.boolean().optional(),
    emailNotificationsEnabled: z.boolean().optional(),
    pushNotificationsEnabled: z.boolean().optional(),
    deviceType: deviceTypeSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateUserPreferenceInput = z.infer<
  typeof createUserPreferenceSchema
>;

export type UpdateUserPreferenceInput = z.infer<
  typeof updateUserPreferenceSchema
>;
