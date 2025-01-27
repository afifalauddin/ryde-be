import { ApiError } from "~/utils/api-error";
import { User, UserModel } from "./user.model";

import { logger } from "~/server";
import { getDistance } from "~/utils/distance";
import { GetNearbyUsersDto } from "./dto/nearby.dto";

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

  async getNearbyUsers(userId: string, dto: GetNearbyUsersDto) {
    const mainUser = await UserModel.findById(userId);

    if (!mainUser) {
      throw ApiError.notFound("User not found");
    }

    if (!mainUser.address) {
      throw ApiError.badRequest(
        "User Address not found. Please update your location",
      );
    }

    //if no coordinates found dont need to calculate distance, just throw error to let user know
    if (!mainUser.address?.latitude || !mainUser.address?.longitude) {
      throw ApiError.badRequest(
        "User Coordinate not found. Please update your coordinate",
      );
    }

    //if he have no followers just return empty array
    if (!mainUser.followers?.length && dto.type === "followers") {
      return [];
    }

    //if he have no followings just return empty array
    if (!mainUser.following?.length && dto.type === "following") {
      return [];
    }

    // Query users with coordinates
    const query = {
      "address.latitude": {
        $exists: true,
      },
      "address.longitude": {
        $exists: true,
      },
      _id: {
        $in: dto.type === "followers" ? mainUser.followers : mainUser.following,
      },
    };

    const users = await UserModel.find(query);

    // Calculate distances and filter
    return users
      .map((user) => ({
        ...user.toObject(),
        //The distance should exist here as we are filtering users with coordinates and check to main user earlier
        distance: getDistance(
          {
            lat: mainUser.address?.latitude ?? 0,
            lng: mainUser.address?.longitude ?? 0,
          },
          {
            lat: user.address?.latitude ?? 0,
            lng: user.address?.longitude ?? 0,
          },
        ),
      }))
      .filter((user) => user.distance <= dto.maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  async updateLocation(userId: string, latitude: number, longitude: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          "address.latitude": latitude,
          "address.longitude": longitude,
        },
      },
      { new: true },
    );
  }
}

export const userService = new UserService();
