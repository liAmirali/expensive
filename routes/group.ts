import { Router } from "express";
import { createGroup } from "../controller/group";
import { isAuth } from "../middlewares/authenticationHandler";
import { throwValidationError } from "../validators/utils";
import { createGroupValidators } from "../validators/group";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", [isAuth, throwValidationError], createGroup);
router.post("/", [isAuth, ...createGroupValidators, throwValidationError], asyncHandler(createGroup));
router.delete("/", [isAuth, throwValidationError], createGroup);

export default router;
