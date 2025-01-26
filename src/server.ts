import express, { type Express } from "express";
import pino from "pino";
import errorMiddleware from "~/middleware/error.middleware";
import requestLogger from "~/middleware/request-logger.middleware";

const app: Express = express();

// Logger
const logger = pino({ name: "server start" });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Routes

// Swagger UI

// Error handlers
app.use(errorMiddleware());

export { app, logger };
