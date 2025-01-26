import { Types } from "mongoose";
import { z } from "zod";

export const userIdDto = z.object({
  id: z.custom<Types.ObjectId>().refine((val) => Types.ObjectId.isValid(val)),
});
