import { env } from "~/utils/env";
import { AuthProvider } from "./auth.class";
import { GoogleAuth } from "./provider/google.provider";
import { ApiError } from "~/utils/api-error";
import { LoginDto } from "./dto/login.dto";

import { logger } from "~/server";

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

    logger.debug({ code: code ?? "N/A", state }, "redirect.login.tokens");

    const token = await client.getTokens({ code });

    if (!token.success) {
      return ApiError.unauthorized("Please check your credentials");
    }

    logger.debug("redirect.login.profile");

    const profile = await client.getProfile({
      accessToken: token.accessToken,
      idToken: token.idToken,
    });

    if (!profile.success) {
      return ApiError.unauthorized("Something wrong with your profile");
    }

    return {
      ...profile,
      token,
    };
  }
}

export const authService = new AuthService();
