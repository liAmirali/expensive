import express from "express";
import { postLogin, postRegister } from "../controller/auth";

const router = express.Router();

router.post("/register", [], postRegister);

router.post("/login", postLogin);

export default router;
