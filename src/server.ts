import express, { type Express } from "express";
import pino from "pino";
import requestLogger from "~/middleware/logger.middleware";

import mongoose from "mongoose";
import { env } from "./utils/env";

import { responseHandler } from "~/middleware/response.middleware";
import { errorHandler, notFoundHandler } from "~/middleware/error.middleware";
import userRouter from "./api/user/user.route";
import { docsRouter } from "./docs/docs.router";
import authRouter from "./api/auth/auth.route";

const app: Express = express();
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
app.use("/auth", authRouter);

// Swagger UI
app.use("/docs", docsRouter);

// Handle unknown routes
app.use(notFoundHandler);

// Error handling
app.use(errorHandler);

export { app, logger };
