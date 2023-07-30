import { Router } from "express";

import authRouter from "./auth";
import expenseRouter from "./expense";

const router = Router();

router.use("/auth", authRouter);
router.use("/expense", expenseRouter);

export default router;
