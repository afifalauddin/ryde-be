import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z); //zod to openapi

export const loginSchema = z
  .object({
    type: z.enum(["google", "apple", "facebook"]),
    state: z.string().optional(),
  })
  .openapi("LoginDto");

export type LoginDto = z.infer<typeof loginSchema>;
