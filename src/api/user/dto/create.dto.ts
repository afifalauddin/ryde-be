import { UserSchema } from "~/api/user/user.model";

export const UserCreateDto = UserSchema.omit({
  followers: true,
  following: true,
}); //remove followers and following from create dto
