import { Router } from "express";
import { createGroup, deleteGroup, listGroups } from "../../controller/group";
import { isAuth } from "../../middlewares/authenticationHandler";
import { throwValidationError } from "../../validators/utils";
import { createGroupValidators, deleteGroupValidators } from "../../validators/group";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", [isAuth], asyncHandler(listGroups));
router.post(
  "/",
  [isAuth, ...createGroupValidators, throwValidationError],
  asyncHandler(createGroup)
);
router.delete(
  "/",
  [isAuth, ...deleteGroupValidators, throwValidationError],
  asyncHandler(deleteGroup)
);

export default router;
