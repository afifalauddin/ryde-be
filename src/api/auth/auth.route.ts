import { authController } from "./auth.controller";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { verifyToken } from "~/middleware/auth.middleware";
import { refreshTokenSchema } from "./dto/refresh.dto";
import { validate } from "~/middleware/validation.middleware";

export const authRegistry = new OpenAPIRegistry();
const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "get",
  path: "/auth/google",
  description: "",
  tags: ["Auth"],
  responses: {
    200: {
      description: "Redirection to Google Login",
    },
  },
});

authRouter.get("/google", authController.initGoogleLogin);
authRouter.get("/google/redirect", authController.googleCallback); //for redirect from google, doesnt need to be exposed in docs

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

authRouter.get("/me", verifyToken, authController.getAuthUser);

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: refreshTokenSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "New Access Token",
    },
  },
});

authRouter.post(
  "/refresh",
  validate(refreshTokenSchema, "body"),
  authController.refreshToken,
);

export default authRouter;
