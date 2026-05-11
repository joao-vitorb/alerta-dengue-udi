import { z } from "zod";

export const testNotificationBodySchema = z.object({
  anonymousId: z.string().trim().min(8).max(120),
  channel: z.enum(["EMAIL", "PUSH"]),
});

export type TestNotificationInput = z.infer<typeof testNotificationBodySchema>;
