import { UserSchema } from "~/api/user/user.model";

//remove email as it should not be updated, unless from a different endpoint
export const UserUpdateDto = UserSchema.omit({ email: true }).partial();
