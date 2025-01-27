import { z } from "zod";

export const getNearbyUsersSchema = z.object({
  maxDistance: z.coerce.number().default(10000), //10km by default, unit in meters
  type: z.enum(["followers", "following"]),
});

export type GetNearbyUsersDto = z.infer<typeof getNearbyUsersSchema>;

export const QueryNearbySchema = z.object({
  query: z.object({ getNearbyUsersSchema }),
});
