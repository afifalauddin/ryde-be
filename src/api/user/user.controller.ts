import { userService } from "./user.service";
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
}

export const userController = new UserController();
