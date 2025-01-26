import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
  async initGoogleLogin(req: Request, res: Response) {
    try {
      const url = await authService.loginUrl({
        state: req.query.state?.toString() ?? "",
        type: "google",
      });
      res.redirect(url);
    } catch (error) {
      if (error instanceof Error) {
        res.error(error);
      }
    }
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const users = await authService.redirectCallback({
        code: req.query.code?.toString() ?? "",
        state: req.query.state?.toString() ?? "",
        type: "google",
      });
      res.success(users);
    } catch (error) {
      res.error(error);
    }
  }
}

export const authController = new AuthController();
