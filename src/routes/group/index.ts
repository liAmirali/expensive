import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  getSingleGroup,
  listGroups,
  updateGroup,
} from "../../controller/group";
import { isAuth } from "../../middlewares/authenticationHandler";
import { throwValidationError } from "../../validators/utils";
import {
  createGroupValidators,
  deleteGroupValidators,
  getGroupListValidators,
  getSingleGroupValidators,
  updateGroupValidators,
} from "../../validators/group";
import { asyncHandler } from "../../utils/asyncHandler";

import occasionRouter from "./occasion";

const router = Router();

router.get(
  "/:groupId",
  [isAuth, ...getSingleGroupValidators, throwValidationError],
  asyncHandler(getSingleGroup)
);
router.get(
  "/",
  [isAuth, ...getGroupListValidators, throwValidationError],
  asyncHandler(listGroups)
);
router.post(
  "/",
  [isAuth, ...createGroupValidators, throwValidationError],
  asyncHandler(createGroup)
);
router.delete(
  "/:groupId",
  [isAuth, ...deleteGroupValidators, throwValidationError],
  asyncHandler(deleteGroup)
);
router.patch(
  "/:groupId",
  [isAuth, ...updateGroupValidators, throwValidationError],
  asyncHandler(updateGroup)
);

router.use("/occasion", occasionRouter);

export default router;
