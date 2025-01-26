type IBaseAuthSuccess = {
  success: true;
};

type IBaseAuthFail = {
  success: false;
};

export type IAuthError = IBaseAuthFail & {
  message: string;
  error: unknown;
};

export type IProviderToken = IBaseAuthSuccess & {
  idToken: string;
  accessToken: string;
};

export type IProviderUser = IBaseAuthSuccess & {
  email: string;
  providerId?: string;
  familyName?: string;
  name?: string;
  picture?: string;
  givenName?: string;
  verifiedEmail?: boolean;
};
