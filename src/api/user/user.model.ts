import { z } from "zod";
import { zodSchema, zId } from "@zodyac/zod-mongoose";
import { model } from "mongoose";
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
    followers: z.array(zId("User")),
    following: z.array(zId("User")),
  })
  .openapi("User");

export const zUserSchema = zodSchema(UserSchema, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      // Transform ObjectId to string
      ret.id = ret._id.toString();

      // Remove MongoDB specific fields
      delete ret._id;
      delete ret.__v;

      ret.email = ret.email ?? null;
      ret.dob = ret.dob ? ret.dob.toISOString() : null;
      ret.address = ret.address ?? null;
      ret.description = ret.description ?? null;
      ret.followers = ret.followers ?? [];
      ret.following = ret.following ?? [];

      return {
        id: ret.id, //make id on top
        ...ret,
      };
    },
  },
});

zUserSchema.index({
  location: "2dsphere",
});

export const UserModel = model("User", zUserSchema); //convert zod schema to mongoose model
export type User = z.infer<typeof UserSchema>; //infer the type from zod schema
