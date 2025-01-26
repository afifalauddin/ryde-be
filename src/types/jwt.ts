import { Types } from "mongoose";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: Types.ObjectId;
  email: string;
}
