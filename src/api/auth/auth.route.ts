import { authController } from "./auth.controller";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";

export const authRegistry = new OpenAPIRegistry();
const authRouter: Router = express.Router();

// authRegistry.register("Auth", );

authRegistry.registerPath({
  method: "get",
  path: "/auth/google",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Redirection to Google Login",
    },
  },
});

authRouter.get("/google", authController.initGoogleLogin);

authRegistry.registerPath({
  method: "get",
  path: "/auth/google/redirect",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Object with user data.",
    },
  },
});

authRouter.get("/google/redirect", authController.googleCallback);

authRegistry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Object with user data.",
    },
    401: {
      description: "Not Authorized",
    },
  },
});

authRouter.get("/me", verifyToken, authController.googleCallback);

export default authRouter;
