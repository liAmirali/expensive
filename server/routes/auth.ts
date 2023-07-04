import express, { Request, Response } from "express";
import { User } from "../models/User";

const router = express.Router();

const users: User[] = [];

router.post("/register", (req: Request, res: Response) => {
  console.log("req.body :>> ", req.body);

  const { name, email, password } = req.body;

  const newUser = new User(name, email, password);

  users.push(newUser);

  res.location("/");
  res.json({ data: { user: newUser }, message: "User was created" });
  res.send();
});

router.get("/users", (req: Request, res: Response) => {
  res.json({ data: { users: users }, message: "Users sent successfully." });
});

export default router;
