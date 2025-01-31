import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidationTarget = "query" | "params" | "body";

// Validate request body against schema, throw if invalid and then would be handled by error handler
export const validate = <T extends z.ZodType>(
  schema: T,
  target: ValidationTarget = "body",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = schema.safeParse(req[target]);
      if (!validation.success) {
        throw validation.error;
      }
      next();
    } catch (error) {
      res.error(error);
    }
  };
};
