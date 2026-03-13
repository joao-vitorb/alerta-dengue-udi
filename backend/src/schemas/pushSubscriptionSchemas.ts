import { z } from "zod";

export const anonymousIdParamSchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
});

export const upsertPushSubscriptionBodySchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
  subscription: z.object({
    endpoint: z.string().trim().url(),
    keys: z.object({
      p256dh: z.string().trim().min(1),
      auth: z.string().trim().min(1),
    }),
    userAgent: z.string().trim().max(500).optional(),
  }),
});

export type UpsertPushSubscriptionInput = z.infer<
  typeof upsertPushSubscriptionBodySchema
>;
