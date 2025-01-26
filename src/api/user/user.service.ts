import { User, UserDocument, UserModel } from "./user.model";

export class UserService {
  async findAll(): Promise<UserDocument[]> {
    return UserModel.find();
  }

  async create(userData: User) {
    const user = new UserModel({
      ...userData,
    });
    return user.save();
  }
}

export const userService = new UserService();
