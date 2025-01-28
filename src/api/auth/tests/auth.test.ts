import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService } from "../auth.service";
import { GoogleAuth } from "../provider/google.provider";
import { userService } from "~/api/user/user.service";
import { jwtService } from "../jwt.service";

vi.mock("~/server", () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../provider/google.provider");
vi.mock("~/api/user/user.service");
vi.mock("../jwt.service");

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("loginUrl", () => {
    it("should return login URL for valid provider", async () => {
      const mockLoginUrl = "https://google.com/auth";
      vi.mocked(GoogleAuth.prototype.getLoginUrl).mockResolvedValue(
        mockLoginUrl,
      );

      const result = await authService.loginUrl({ type: "google" });
      expect(result).toBe(mockLoginUrl);
    });
  });

  describe("redirectCallback", () => {
    const mockCode = "auth-code";
    const mockState = "state";
    const mockTokens = {
      success: true,
      accessToken: "access-token",
      idToken: "id-token",
    };
    const mockProfile = {
      success: true,
      email: "test@example.com",
      name: "Test User",
    };

    beforeEach(() => {
      //@ts-expect-error type union mismatch
      vi.mocked(GoogleAuth.prototype.getTokens).mockResolvedValue(mockTokens);

      //@ts-expect-error type union mismatch
      vi.mocked(GoogleAuth.prototype.getProfile).mockResolvedValue(mockProfile);
    });

    it("should handle successful OAuth flow", async () => {
      const mockUser = {
        _id: "user-id",
        email: "test@example.com",
        name: "Test User",
      };
      const mockTokenResponse = {
        accessToken: "jwt-access-token",
        refreshToken: "jwt-refresh-token",
      };

      //@ts-expect-error type union mismatch
      vi.mocked(userService.upsertUser).mockResolvedValue(mockUser);
      vi.mocked(jwtService.generateTokens).mockReturnValue(mockTokenResponse);

      const result = await authService.redirectCallback({
        type: "google",
        code: mockCode,
        state: mockState,
      });

      expect(result).toEqual({
        accessToken: mockTokenResponse.accessToken,
        refreshToken: mockTokenResponse.refreshToken,
        user: mockUser,
      });
    });

    it("should throw error when code is missing", async () => {
      await expect(
        authService.redirectCallback({
          type: "google",
          code: "",
          state: mockState,
        }),
      ).rejects.toThrow("Code is required");
    });

    it("should throw error when token retrieval fails", async () => {
      vi.mocked(GoogleAuth.prototype.getTokens).mockResolvedValue({
        success: false,

        //@ts-expect-error type union mismatch
        accessToken: "",
        idToken: "",
      });

      await expect(
        authService.redirectCallback({
          type: "google",
          code: mockCode,
          state: mockState,
        }),
      ).rejects.toThrow("Please check your credentials");
    });

    it("should throw error when profile retrieval fails", async () => {
      vi.mocked(GoogleAuth.prototype.getProfile).mockResolvedValue({
        success: false,

        //@ts-expect-error type union mismatch
        email: "",
        name: "",
      });

      await expect(
        authService.redirectCallback({
          type: "google",
          code: mockCode,
          state: mockState,
        }),
      ).rejects.toThrow("Failed to get oAuth Profile");
    });
  });

  describe("loginOrRegister", () => {
    const mockProfile = {
      email: "test@example.com",
      name: "Test User",
    };

    it("should create new user and return tokens", async () => {
      const mockUser = {
        _id: "user-id",
        email: "test@example.com",
        name: "Test User",
      };
      const mockTokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      //@ts-expect-error type union mismatch
      vi.mocked(userService.upsertUser).mockResolvedValue(mockUser);

      vi.mocked(jwtService.generateTokens).mockReturnValue(mockTokens);

      //@ts-expect-error type union mismatch
      const result = await authService.loginOrRegister(mockProfile);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: mockUser,
      });
    });

    it("should throw error when user creation fails", async () => {
      //@ts-expect-error type union mismatch
      vi.mocked(userService.upsertUser).mockResolvedValue(null);

      //@ts-expect-error type union mismatch
      await expect(authService.loginOrRegister(mockProfile)).rejects.toThrow(
        "Failed to create user",
      );
    });
  });

  describe("refreshAccessToken", () => {
    const mockRefreshToken = "refresh-token";
    const mockPayload = {
      sub: "user-id",
      email: "test@example.com",
    };

    it("should refresh access token successfully", async () => {
      const mockUser = {
        _id: "user-id",
        email: "test@example.com",
      };
      const mockNewAccessToken = "new-access-token";

      vi.mocked(jwtService.verifyRefreshToken).mockReturnValue(mockPayload);

      //@ts-expect-error type union mismatch
      vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
      vi.mocked(jwtService.signAccessToken).mockReturnValue(mockNewAccessToken);

      const result = await authService.refreshAccessToken(mockRefreshToken);

      expect(result).toEqual({
        accessToken: mockNewAccessToken,
      });
    });

    it("should throw error for invalid refresh token", async () => {
      vi.mocked(jwtService.verifyRefreshToken).mockReturnValue(null);

      await expect(
        authService.refreshAccessToken(mockRefreshToken),
      ).rejects.toThrow("Invalid refresh token");
    });
  });

  describe("getAuthedUser", () => {
    it("should return user by ID", async () => {
      const mockUser = {
        _id: "user-id",
        email: "test@example.com",
      };

      //@ts-expect-error type union mismatch
      vi.mocked(userService.getUserById).mockResolvedValue(mockUser);

      const result = await authService.getAuthedUser("user-id");
      expect(result).toEqual(mockUser);
    });
  });
});
