import { TokenPair } from "~/types/jwt";
import { env } from "~/utils/env";
import jwt, { JwtPayload } from "jsonwebtoken";

export class JwtService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly accessTokenExpiry;
  private readonly refreshTokenExpiry;

  constructor() {
    this.secret = env.JWT_SECRET;
    this.refreshSecret = env.REFRESH_SECRET;
    //NOTE: This can be a env variable as well if we need
    this.accessTokenExpiry = "30m" as const; // 30 minutes
    this.refreshTokenExpiry = "14d" as const; // 14 days
  }

  /**
   * Generate both access and refresh tokens
   */
  generateTokens<T extends object>(payload: T): TokenPair {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Sign a new access token
   */
  private signAccessToken<T extends JwtPayload>(payload: T) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  /**
   * Sign a new refresh token
   */
  private signRefreshToken<T extends JwtPayload>(payload: T) {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken<T>(token: string) {
    try {
      return jwt.verify(token, this.secret) as T;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Verify refresh token
   * @param token - Refresh token to verify
   */
  verifyRefreshToken<T>(token: string) {
    try {
      return jwt.verify(token, this.refreshSecret) as T;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken<T>(refreshToken: string) {
    const payload = this.verifyRefreshToken<T>(refreshToken);

    if (!payload) {
      return undefined;
    }

    return this.signAccessToken(payload);
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader?: string) {
    if (!authHeader?.startsWith("Bearer ")) {
      return undefined;
    }

    const [_, token] = authHeader.split(" ");

    return token;
  }
}

export const jwtService = new JwtService();
