import express, { type Express } from "express";
import pino from "pino";
import requestLogger from "~/middleware/request-logger.middleware";

import userRouter from "~/api/user/user.route";
import mongoose from "mongoose";
import { env } from "./utils/env";

import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { extendZod } from "@zodyac/zod-mongoose";
import { responseHandler } from "~/middleware/response-handler.middleware";
import {
  errorHandler,
  notFoundHandler,
} from "~/middleware/error-handler.middleware";

const app: Express = express();

extendZod(z); //zod to mongoose
extendZodWithOpenApi(z); //zod to openapi

// Logger
const logger = pino({
  name: "RYDE_USER",
  //if not in production, use pino-pretty for better local readability
  ...(env.NODE_ENV !== "production" && {
    transport: { target: "pino-pretty" },
  }),
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);

// Request logging
app.use(requestLogger);

// DB Connection
await mongoose.connect(env.DB_URL).catch((error) => {
  logger.error(
    {
      error,
    },
    "MongoDB connection error:",
  );
});

// Routes
app.use("/user", userRouter);

// Handle unknown routes
app.use(notFoundHandler);

// Error handling
app.use(errorHandler);

// Swagger UI

export { app, logger };
