import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "~/utils/api-error";
import { env } from "~/utils/env";

export const verifyToken: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.length) {
      throw ApiError.unauthorized("Missing Auth Token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    //TODO: Add user to request object
    //@ts-ignore
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized("Invalid Token");
  }
};
