import { Router } from "express";

import authRouter from "./auth";
import expenseRouter from "./expense";
import groupRouter from "./group";
import userRouter from "./user"

const router = Router();

router.use("/auth", authRouter);
router.use("/expense", expenseRouter);
router.use("/group", groupRouter);
router.use("/user", userRouter)

export default router;
