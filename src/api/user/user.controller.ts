import { UserSchema } from "./user.model";
import { userService } from "./user.service";
import { Request, Response } from "express";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async findAll(_: Request, res: Response) {
    const users = await userService.findAll();
    res.json(users);
  }
}

export const userController = new UserController();
