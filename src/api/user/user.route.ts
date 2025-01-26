import { validateRequest } from "~/middleware/validation.middleware";
import { userController } from "./user.controller";
import { Router } from "express";
import { UserSchema } from "./user.model";

const router = Router();

router.post("/", validateRequest(UserSchema), userController.create);
router.get("/", userController.findAll);

export default router;
