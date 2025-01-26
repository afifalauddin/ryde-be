import { validate } from "~/middleware/validation.middleware";
import { userController } from "./user.controller";
import { UserSchema, UserUpdateSchema } from "./user.model";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { userIdDto } from "./dto/user.dto";

export const userRegistry = new OpenAPIRegistry();
const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "post",
  path: "/user",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
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

userRouter.post("/", validate(UserSchema), userController.create);
userRouter.get("/list", userController.findAll);

userRegistry.registerPath({
  method: "get",
  path: "/user/{id}",
  tags: ["User"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
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

userRouter.get("/:id", validate(userIdDto, "params"), userController.get);

userRegistry.registerPath({
  method: "patch",
  path: "/user/{id}",
  tags: ["User"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserUpdateSchema,
        },
      },
    },
  },
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

userRouter.patch(
  "/:id",
  validate(userIdDto, "params"),
  validate(UserUpdateSchema, "body"),
  userController.update,
);

userRegistry.registerPath({
  method: "get",
  path: "/user/list",
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

export default userRouter;
