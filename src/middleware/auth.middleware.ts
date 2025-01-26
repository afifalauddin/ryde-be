import { Request, Response, NextFunction, RequestHandler } from "express";
import { ApiError } from "~/utils/api-error";

import { jwtService } from "~/api/auth/jwt.service";
import { JwtPayload } from "~/types/jwt";

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw ApiError.unauthorized("No Auth provided");
    }

    const payload = jwtService.verifyAccessToken<JwtPayload>(token);

    if (!payload) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    req.user = payload;

    next();
  } catch (error) {
    res.error(error);
  }
};
