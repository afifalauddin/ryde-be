import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    HOST: z.string(),
    PORT: z.coerce.number().default(3003),
    DB_URL: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
  },

  emptyStringAsUndefined: true,
});
