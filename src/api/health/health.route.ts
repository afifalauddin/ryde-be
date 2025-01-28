import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";

export const healthRegistry = new OpenAPIRegistry();
export const healthRouter: Router = express.Router();

healthRegistry.registerPath({
  method: "get",
  path: "/",
  tags: ["Health Check"],
  responses: {
    200: {
      description: "Server is up and running",
    },
  },
});

healthRouter.get("/", (_req: Request, res: Response) => {
  res.success({ status: "OK" });
});
