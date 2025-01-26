import { env } from "~/utils/env";
import { AuthProvider } from "./auth.class";
import { GoogleAuth } from "./provider/google.provider";
import { ApiError } from "~/utils/api-error";
import { LoginDto } from "./dto/login.dto";

import { userService } from "~/api/user/user.service";

import { logger } from "~/server";
import { IProviderUser } from "./type/provider.type";

import { jwtService } from "./jwt.service";

class AuthService {
  private Provider: Record<string, AuthProvider> = {};
  constructor() {
    this.Provider["google"] = new GoogleAuth({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: env.GOOGLE_CALLBACK_URL,
    });

    /** This is where we can add more providers like Facebook, Apple, etc.
     * Pre-requisite: Implement the provider class and add import it in this file.
     * Example:
     *     this.Provider["facebook"] = new FacebookAuth({
     *          clientId: env.GOOGLE_CLIENT_ID,
     *          clientSecret: env.GOOGLE_CLIENT_SECRET,
     *          redirectUri: env.GOOGLE_CALLBACK_URL,
     *        });
     */
  }

  invalidProvider(provider: string) {
    return ApiError.methodNotAllowed(`${provider} is not implemented`);
  }

  async loginUrl(data: LoginDto) {
    const client = this.Provider[data.type];
    return client.getLoginUrl(data.state ?? "");
  }

  async redirectCallback({
    type,
    code,
    state,
  }: {
    type: string;
    code: string;
    state: string;
  }) {
    const client = this.Provider[type];

    if (!client) {
      this.invalidProvider(type);
    }

    logger.debug({ code: code ?? "N/A", state }, "redirectCallback");

    if (!code) {
      throw ApiError.badRequest("Code is required");
    }

    const token = await client.getTokens({ code });

    if (!token.success) {
      throw ApiError.unauthorized("Please check your credentials");
    }

    logger.debug("redirectCallback.Profile...");

    const profile = await client.getProfile({
      accessToken: token.accessToken,
      idToken: token.idToken,
    });

    if (!profile.success) {
      throw ApiError.badRequest("Failed to get oAuth Profile");
    }

    logger.debug({ profile }, "redirectCallback.Profile");

    return this.loginOrRegister(profile);
  }

  async loginOrRegister(pUser: IProviderUser) {
    const { email, name } = pUser;
    logger.debug({ email, name }, "loginOrRegister...");

    const user = await userService.upsertUser(
      {
        email: email,
      },
      {
        name,
      },
    );

    logger.debug({ user }, "loginOrRegister.created");

    if (!user) {
      throw ApiError.badRequest("Failed to create user");
    }

    const { accessToken, refreshToken } = jwtService.generateTokens({
      userId: user.toJSON()._id,
      email: user.email,
    });

    //NOTE: This should response redirection
    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}

export const authService = new AuthService();
