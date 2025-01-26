import {
  IAuthError,
  IProviderToken,
  IProviderUser,
} from "./type/provider.type";

/**
 * Abstract base class for authentication providers
 * Defines the contract for implementing OAuth authentication flows
 * One provider class per OAuth provider (Google, Facebook, etc.), its adhere to SOLID principles
 * and the Open/Closed Principle, as we can add new providers without modifying existing code
 */
export abstract class AuthProvider {
  constructor() {}
  abstract getLoginUrl(state: string): string;
  abstract getTokens({
    code,
  }: {
    code: string;
  }): Promise<IProviderToken | IAuthError>;
  abstract getProfile({
    accessToken,
    idToken,
  }: {
    accessToken: string;
    idToken: string;
  }): Promise<IProviderUser | IAuthError>;

  abstract getRefreshToken({
    token,
  }: {
    token: string;
  }): Promise<IProviderToken | IAuthError>;
}
