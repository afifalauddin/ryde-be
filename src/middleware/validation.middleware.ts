import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidationTarget = "query" | "params" | "body";

export const validate = <T extends z.ZodType>(
  schema: T,
  target: ValidationTarget = "body",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync(req[target]);
      // Replace the request data with the validated result
      req[target] = result;
      next();
    } catch (error) {
      res.error(error);
    }
  };
};
