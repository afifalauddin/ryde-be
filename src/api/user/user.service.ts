import { ApiError } from "~/utils/api-error";
import { User, UserModel } from "./user.model";

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
    return await UserModel.findOneAndUpdate(
      filter,
      { $set: update },
      {
        upsert: true,
        runValidators: true,
      },
    );
  }

  async create(data: User) {
    logger.debug("create", data);
    const { email, ...others } = data;

    try {
      const user = await this.upsertUser({ email: data.email }, others);

      if (!user) {
        throw ApiError.badRequest("Failed to create user");
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();
