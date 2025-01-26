import { z } from "zod";
import { zodSchema } from "@zodyac/zod-mongoose";
import { model, Document } from "mongoose";
import { extendZod } from "@zodyac/zod-mongoose";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZod(z); //zod to mongoose
extendZodWithOpenApi(z); //zod to openapi

export const UserSchema = z
  .object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    dob: z.date().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
    description: z.string().optional(),
  })
  .openapi("User");

const zodUser = zodSchema(UserSchema, {
  toJSON: {
    transform: (_, ret) => {
      // Transform ObjectId to string
      ret.id = ret._id.toString();

      // Remove MongoDB specific fields
      delete ret._id;
      delete ret.__v;

      ret.email = ret.email ?? undefined;
      ret.dob = ret.dob ? ret.dob.toISOString() : undefined;
      ret.address = ret.address ?? undefined;
      ret.description = ret.description ?? undefined;

      return ret;
    },
  },
});

export const UserModel = model("User", zodUser);
export type User = z.infer<typeof UserSchema>;

export interface UserDocument extends User, Document {}
