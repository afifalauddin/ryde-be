import { ApiError } from "~/utils/api-error";
import { User, UserModel } from "./user.model";

import { logger } from "~/server";

/**
 * Service class for handling user-related operations
 */
export class UserService {
  // Get all users with pagination
  async getAllUser(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, totalItems] = await Promise.all([
      UserModel.find().skip(skip).limit(limit).lean().exec(),
      UserModel.countDocuments(),
    ]);

    return {
      users: users.map((user) => UserModel.hydrate(user).toJSON()), //hydrate user
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  // insert or update user
  async upsertUser(filter: Partial<User>, update: Partial<User>) {
    return UserModel.findOneAndUpdate(
      filter,
      { $set: update },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }

  async createUser(data: User) {
    logger.debug(data, "UserService.create");
    const { email, ...others } = data;

    const user = await this.upsertUser({ email: data.email }, others);

    if (!user) {
      throw ApiError.badRequest("Failed to create user");
    }

    return user.toJSON();
  }

  async updateUserById(userId: string, data: Partial<User>) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true },
    );

    if (!user) {
      throw ApiError.badRequest("User not found");
    }

    return user.toJSON();
  }

  async getUserById(userId: string) {
    logger.info({ userId }, "UserService.getUserById");
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user.toJSON();
  }

  async deleteUserById(userId: string) {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw ApiError.badRequest("User not found");
    }
    return user;
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw ApiError.badRequest("Users cannot follow themselves");
    }

    const [currentUser, targetUser] = await Promise.all([
      UserModel.findById(currentUserId),
      UserModel.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      throw ApiError.notFound("User not found");
    }

    // Check if already following
    if (currentUser.following?.includes(targetUserId)) {
      throw ApiError.badRequest("Already following this user");
    }

    // Add to following/followers
    await Promise.all([
      UserModel.findByIdAndUpdate(currentUserId, {
        $push: { following: targetUserId },
      }),
      UserModel.findByIdAndUpdate(targetUserId, {
        $push: { followers: currentUserId },
      }),
    ]);

    return {
      message: "Successfully followed user",
    };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw ApiError.badRequest("Users cannot unfollow themselves");
    }

    const [currentUser, targetUser] = await Promise.all([
      UserModel.findById(currentUserId),
      UserModel.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      throw ApiError.notFound("User not found");
    }

    // Check if not following
    if (!currentUser.following.includes(targetUserId)) {
      throw ApiError.notFound("Not following this user");
    }

    // Remove from following/followers
    await Promise.all([
      UserModel.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
      }),
      UserModel.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
      }),
    ]);

    return {
      message: "Successfully unfollowed user",
    };
  }

  //check if user is following, follower or mutual
  async getFollowStatus(currentUserId: string, targetUserId: string) {
    const [currentUser, targetUser] = await Promise.all([
      UserModel.findById(currentUserId),
      UserModel.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      throw ApiError.notFound("User not found");
    }

    const isFollowing = currentUser.following?.includes(targetUserId) ?? false;
    const isFollower = targetUser.following?.includes(currentUserId) ?? false;
    const isMutual = isFollower && isFollowing;

    return {
      isFollowing,
      isFollower,
      isMutual,
    };
  }

  //return user with followers and following
  async getFollowList(userId: string) {
    logger.debug({ userId }, "UserService.getFollowList...");

    const user = await UserModel.findById(userId)
      .populate("followers name")
      .populate("following name");

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }
}

export const userService = new UserService();
