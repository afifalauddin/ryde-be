import { userService } from "./user.service";
import { Request, Response } from "express";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
      res.success(user);
    } catch (error) {
      if (error instanceof Error) {
        res.error(error);
      }
    }
  }

  async findAll(_: Request, res: Response) {
    const users = await userService.findAll();
    res.success(users);
  }
}

export const userController = new UserController();
