import { ApiError } from "~/utils/api-error";
import { userService } from "../user.service";
import { Request, Response } from "express";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await userService.updateUserById(req.params.id, req.body);
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await userService.deleteUserById(req.params.id);
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async findAll(_: Request, res: Response) {
    try {
      const { users, pagination } = await userService.getAllUser();
      res.successWithPagination(users, pagination);
    } catch (error) {
      res.error(error);
    }
  }

  async followUser(req: Request, res: Response) {
    if (!req.user) {
      throw ApiError.unauthorized("Auth not found");
    }
    try {
      const result = await userService.followUser(
        req.user.sub,
        req.body.userId,
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }

  async unfollowUser(req: Request, res: Response) {
    if (!req.user) {
      throw ApiError.unauthorized("Auth not found");
    }
    try {
      const result = await userService.unfollowUser(
        req.user.sub,
        req.body.userId,
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }

  async getFollowStatus(req: Request, res: Response) {
    if (!req.user) {
      throw ApiError.unauthorized("Auth not found");
    }

    try {
      const result = await userService.getFollowStatus(
        req.user.sub,
        req.params.id,
      );
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }

  async getFollowList(req: Request, res: Response) {
    if (!req.user) {
      throw ApiError.unauthorized("Auth not found");
    }

    try {
      const result = await userService.getFollowList(req.user.sub);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  }
}

export const userController = new UserController();
