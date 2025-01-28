import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth.middleware";
import { jwtService } from "~/api/auth/jwt.service";
import { ApiError } from "~/utils/api-error";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";

vi.mock("~/api/auth/jwt.service");

describe("verifyToken middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer valid.token.here",
      },
    };
    res = {
      error: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call next if token is valid", () => {
    (jwtService.extractTokenFromHeader as Mock).mockReturnValue(
      "valid.token.here",
    );
    (jwtService.verifyAccessToken as Mock).mockReturnValue({ userId: "123" });

    verifyToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: "123" });
  });

  it("should return unauthorized error if no token is provided", () => {
    req.headers!.authorization = "";

    verifyToken(req as Request, res as Response, next);

    expect(res.error).toHaveBeenCalledWith(
      ApiError.unauthorized("No Auth provided"),
    );
  });

  it("should return unauthorized error if token is invalid", () => {
    (jwtService.extractTokenFromHeader as Mock).mockReturnValue(
      "invalid.token.here",
    );
    (jwtService.verifyAccessToken as Mock).mockReturnValue(null);

    verifyToken(req as Request, res as Response, next);

    expect(res.error).toHaveBeenCalledWith(
      ApiError.unauthorized("Invalid or expired token"),
    );
  });
});
