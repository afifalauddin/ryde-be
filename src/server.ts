import express, { type Express } from "express";
import pino from "pino";
import errorMiddleware from "~/middleware/error.middleware";
import requestLogger from "~/middleware/request-logger.middleware";

import userRouter from "~/api/user/user.route";
import mongoose from "mongoose";
import { env } from "./utils/env";

const app: Express = express();

// Logger
const logger = pino({ name: "server start" });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// DB Connection
await mongoose
  .connect(env.DB_URL)
  .then(() => {
    logger.info("Connected to DB");
  })
  .catch((error) => {
    logger.error(
      {
        error,
      },
      "MongoDB connection error:",
    );
  });

// Routes
app.use("/user", userRouter);

// Swagger UI

// Error handlers
app.use(errorMiddleware());

export { app, logger };
