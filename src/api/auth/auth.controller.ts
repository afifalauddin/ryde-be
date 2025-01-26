import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiError } from "~/utils/api-error";
import { logger } from "~/server";

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
      const user = await authService.redirectCallback({
        code: req.query.code?.toString() ?? "",
        state: req.query.state?.toString() ?? "",
        type: "google",
      });
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async getAuthUser(req: Request, res: Response) {
    logger.debug({ user: req.user }, "getAuthUser...");
    try {
      if (!req.user) {
        throw ApiError.unauthorized("Auth not found");
      }
      const user = await authService.getAuthedUser(req.user.sub);
      res.success(user);
    } catch (error) {
      res.error(error);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const accessToken = await authService.refreshAccessToken(
        req.body.refreshToken,
      );
      res.success(accessToken);
    } catch (error) {
      res.error(error);
    }
  }
}

export const authController = new AuthController();
