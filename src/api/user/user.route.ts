import { validateRequest } from "~/utils/request";
import { userController } from "./user.controller";
import { UserSchema } from "./user.model";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const userRegistry = new OpenAPIRegistry();
const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/user",
  tags: ["User"],
  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
});

userRouter.get("/", userController.findAll);

userRegistry.registerPath({
  method: "post",
  path: "/user",
  tags: ["User"],
  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
});

userRouter.post("/", validateRequest(UserSchema), userController.create);

export default userRouter;
