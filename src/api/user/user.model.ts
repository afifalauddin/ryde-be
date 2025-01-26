import { z } from "zod";
import { zodSchema } from "@zodyac/zod-mongoose";
import { model, Document } from "mongoose";

export const UserSchema = z.object({
  name: z.string().min(3).max(255),
  dob: z.date().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  description: z.string().optional(),
});

const zUser = zodSchema(UserSchema);
export const UserModel = model("User", zUser);

export type User = z.infer<typeof UserSchema>;

export interface UserDocument extends User, Document {}
