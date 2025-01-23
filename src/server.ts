import express, { type Express } from "express";
import errorMiddleware from "~/middleware/error.middleware";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
// app.use(requestLogger);

// Routes

// Swagger UI

// Error handlers
app.use(errorMiddleware());

export { app };
