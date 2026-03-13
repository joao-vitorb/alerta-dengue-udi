import { z } from "zod";

export const testNotificationBodySchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
});

export type TestNotificationInput = z.infer<typeof testNotificationBodySchema>;
