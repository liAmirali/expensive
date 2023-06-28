"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
const users = [];
router.post("/register", (req, res) => {
    console.log("req.body :>> ", req.body);
    const { name, email, password } = req.body;
    const newUser = new User_1.User(name, email, password);
    users.push(newUser);
    res.location("/");
    res.json({ data: newUser, message: "User was created" });
    res.send();
});
exports.default = router;
