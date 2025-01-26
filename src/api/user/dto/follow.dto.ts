import { z } from "zod";

export const UserFollowDto = z.object({
  userId: z.string(),
});
