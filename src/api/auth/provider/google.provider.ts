import * as querystring from "querystring";
import axios, { type AxiosError } from "axios";
import { AuthProvider } from "~/api/auth/auth.class";
import { GoogleAuthOptions } from "~/api/auth/type/google.type";

/**
 * GoogleAuth provider class implementing AuthProvider interface
 * Handles OAuth2 authentication flow with Google's authentication services
 */
export class GoogleAuth implements AuthProvider {
  private rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  /**
   * Initializes the Google OAuth provider with required credentials
   * @param {GoogleAuthOptions} options - Configuration options for Google OAuth
   * @param {string} options.clientId - The Google OAuth client ID
   * @param {string} options.clientSecret - The Google OAuth client secret
   * @param {string} options.redirectUri - The callback URL after authentication
   */
  constructor({ clientId, clientSecret, redirectUri }: GoogleAuthOptions) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.clientSecret = clientSecret;
  }

  /**
   * Generates the Google OAuth login URL with necessary parameters
   * @param {string} state - A unique state that we can use to prevent attack / pass data if we wanna have some data in the callback
   */
  getLoginUrl(state: string): string {
    const options = {
      client_id: this.clientId,
      response_type: "code", //ask google to return an authorization code
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ].join(" "),
      redirect_uri: this.redirectUri,
      state: state,
      // nonce: '',
    };
    return `${this.rootUrl}?${querystring.stringify(options, "&", "=")}`;
  }

  /**
   * Retrieves tokens from Google using the authorization code.
   */
  async getTokens({ code }: { code: string }) {
    return axios
      .post<{
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        id_token: string;
      }>(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: "authorization_code",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((response) => {
        return {
          success: true as const,
          accessToken: response.data.access_token,
          idToken: response.data.id_token,
        };
      })
      .catch((error: AxiosError) => {
        return {
          success: false as const,
          message: "Failed to get user profile",
          error: error.response?.data ?? error.cause ?? error.message,
        };
      });
  }

  /**
   * Retrieves the user's profile information from Google
   */
  async getProfile({ accessToken }: { accessToken: string }) {
    return axios
      .get<{
        id: string;
        email: string;
        verified_email: boolean;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
      }>("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        return {
          success: true as const,
          email: response.data.email,
          providerId: response.data.id,
          familyName: response.data.family_name,
          name: response.data.name,
          picture: response.data.picture,
          givenName: response.data.given_name,
          verifiedEmail: response.data.verified_email,
        };
      })
      .catch((error: AxiosError) => {
        return {
          success: false as const,
          message: "Failed to get user profile",
          error: error.response?.data ?? error.cause ?? error.message,
        };
      });
  }

  /**
   * Get the refresh token from Google
   */
  async getRefreshToken({ token }: { token: string }) {
    return axios
      .post<{
        access_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
        id_token: string;
      }>(
        "https://oauth2.googleapis.com/token",
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: token,
          grant_type: "refresh_token",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      )
      .then((response) => {
        return {
          success: true as const,
          accessToken: response.data.access_token,
          idToken: response.data.id_token,
        };
      })
      .catch((error: AxiosError) => {
        return {
          success: false as const,
          message: "Failed to refresh ID token",
          error: error.response?.data ?? error.cause ?? error.message,
        };
      });
  }
}
