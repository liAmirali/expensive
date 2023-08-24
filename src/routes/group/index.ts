import { Router } from "express";
import { createGroup, deleteGroup, getSingleGroup, listGroups } from "../../controller/group";
import { isAuth } from "../../middlewares/authenticationHandler";
import { throwValidationError } from "../../validators/utils";
import {
  createGroupValidators,
  deleteGroupValidators,
  getGroupListValidators,
  getSingleGroupValidators,
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
  "/",
  [isAuth, ...deleteGroupValidators, throwValidationError],
  asyncHandler(deleteGroup)
);

router.use("/occasion", occasionRouter);

export default router;
