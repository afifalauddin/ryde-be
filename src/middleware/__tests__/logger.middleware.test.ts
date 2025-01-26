import express from "express";
import request from "supertest";

import errorHandler from "~/middleware/error.middleware";
import requestLogger from "~/middleware/request-logger.middleware";

describe("Request Logger Middleware", () => {
  const app = express();

  beforeAll(() => {
    app.use(requestLogger);
    //@ts-expect-error just for testing
    app.get("/success", (_, res) => res.status(200).send("Success"));
    app.get("/redirect", (_, res) => res.redirect("/success"));
    app.get("/error", () => {
      throw new Error("Test error");
    });
    app.use(errorHandler());
  });

  describe("Successful requests", () => {
    it("logs successful requests", async () => {
      const response = await request(app).get("/success");
      expect(response.status).toBe(200);
    });

    it("checks existing request id", async () => {
      const requestId = "test-request-id";
      const response = await request(app)
        .get("/success")
        .set("X-Request-Id", requestId);
      expect(response.status).toBe(200);
    });
  });

  describe("Re-directions", () => {
    it("logs re-directions correctly", async () => {
      const response = await request(app).get("/redirect");
      expect(response.status).toBe(302);
    });
  });

  describe("Error handling", () => {
    it("logs thrown errors with a 500 status code", async () => {
      const response = await request(app).get("/error");
      expect(response.status).toBe(500);
    });

    it("logs 404 for unknown routes", async () => {
      const response = await request(app).get("/unknown");
      expect(response.status).toBe(404);
    });
  });
});
