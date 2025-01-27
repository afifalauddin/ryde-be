import { z } from "zod";

export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
