import { Router } from "express";

import authRouter from "./auth";
import expenseRouter from "./expense";
import groupRouter from "./group";

const router = Router();

router.use("/auth", authRouter);
router.use("/expense", expenseRouter);
router.use("/group", groupRouter);

export default router;
