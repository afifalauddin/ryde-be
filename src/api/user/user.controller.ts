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
      const users = await userService.findAll();
      res.success(users);
    } catch (error) {
      res.error(error);
    }
  }
}

export const userController = new UserController();
