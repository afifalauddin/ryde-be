import { ApiError } from "~/utils/api-error";
import { User, UserModel, UserUpdateDto } from "./user.model";

import { logger } from "~/server";

export class UserService {
  async getAllUser(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, totalItems] = await Promise.all([
      UserModel.find().skip(skip).limit(limit).lean().exec(),
      UserModel.countDocuments(),
    ]);

    return {
      users: users.map((user) => UserModel.hydrate(user).toJSON()),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

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

  async updateUserById(userId: string, data: Partial<UserUpdateDto>) {
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
}

export const userService = new UserService();
