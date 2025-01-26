import { userService } from "./user.service";
import { Request, Response } from "express";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
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
