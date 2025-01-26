import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z); //zod to openapi

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string(),
  })
  .openapi("RefreshTokenDto");

export type LoginDto = z.infer<typeof refreshTokenSchema>;
