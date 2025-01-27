import { validate } from "~/middleware/validation.middleware";
import { userController } from "./dto/user.controller";
import { UserSchema } from "./user.model";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { userIdDto } from "./dto/user.dto";
import { verifyToken } from "~/middleware/auth.middleware";
import { UserCreateDto } from "./dto/create.dto";
import { UserFollowDto } from "./dto/follow.dto";
import { UserUpdateDto } from "./dto/update.dto";
import { getNearbyUsersSchema, QueryNearbySchema } from "./dto/nearby.dto";
import { locationSchema } from "./dto/location.dto";

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
          schema: UserCreateDto,
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

userRouter.post("/", validate(UserCreateDto), userController.create);
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
          schema: UserUpdateDto,
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

userRegistry.registerPath({
  method: "post",
  path: "/user/follow",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserFollowDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Operation successful",
    },
  },
});

userRouter.post(
  "/follow",
  verifyToken,
  validate(UserFollowDto, "body"),
  userController.followUser,
);

userRegistry.registerPath({
  method: "post",
  path: "/user/unfollow",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserFollowDto,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Operation successful",
    },
  },
});

userRouter.post(
  "/unfollow",
  verifyToken,
  validate(UserFollowDto, "body"),
  userController.unfollowUser,
);

userRegistry.registerPath({
  method: "get",
  path: "/user/follow/list",
  tags: ["User"],

  responses: {
    200: {
      description: "Object with user data.",
    },
  },
});

userRouter.get("/follow/list", verifyToken, userController.getFollowList);

userRegistry.registerPath({
  method: "get",
  path: "/user/follow/{id}",
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
      description: "Operation successful",
    },
  },
});

userRouter.get(
  "/follow/:id",
  verifyToken,
  validate(userIdDto, "params"),
  userController.getFollowStatus,
);

userRegistry.registerPath({
  method: "get",
  path: "/user/location/nearby",
  tags: ["User"],
  request: {
    query: QueryNearbySchema.shape.query,
  },
  responses: {
    200: {
      description: "",
    },
  },
});

userRouter.get(
  "/location/nearby",
  verifyToken,
  validate(getNearbyUsersSchema, "query"),
  userController.getNearbyUsers,
);

userRegistry.registerPath({
  method: "patch",
  path: "/user/location",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: locationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

userRouter.patch(
  "/location",
  verifyToken,
  validate(locationSchema, "body"),
  userController.updateLocation,
);

userRouter.patch(
  "/:id",
  validate(userIdDto, "params"),
  validate(UserUpdateDto, "body"),
  userController.update,
);

export default userRouter;
