import express, { type Express } from "express";
import request from "supertest";
import errorHandler from "~/middleware/response-handler.middleware";
import { ApiError } from "~/utils/api-error";

describe("Error Handler Middleware", () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    app.get("/error", () => {
      throw ApiError.internal("Test error");
    });
    app.get("/next-error", (_req, _res, next) => {
      const error = new Error("Error passed to next()");
      next(error);
    });

    app.use(errorHandler());
    //@ts-expect-error ignore type
    app.use("*", (_, res) => res.error(ApiError.notFound("Not found")));
  });

  describe("Handling unknown routes", () => {
    it("returns 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown-route");
      expect(response.status).toBe(404);
    });
  });

  describe("Handling thrown errors", () => {
    it("handles thrown errors with a 500 status code", async () => {
      const response = await request(app).get("/error");
      expect(response.status).toBe(500);
    });
  });

  describe("Handling errors passed to next()", () => {
    it("handles errors passed to next() with a 500 status code", async () => {
      const response = await request(app).get("/next-error");

      expect(response.status).toBe(500);
    });
  });
});
