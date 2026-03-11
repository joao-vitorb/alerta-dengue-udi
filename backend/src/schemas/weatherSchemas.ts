import { z } from "zod";

export const weatherContextQuerySchema = z.object({
  neighborhood: z.string().trim().min(2).max(120),
});
