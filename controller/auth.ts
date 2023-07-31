import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ApiError } from "../utils/errors";

config();

export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.exists({ email: email });

  // Checking if a user with the entered email exists
  if (existingUser !== null) {
    const error = new ApiError("User with this email already exists", 400);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Creating the user model
  const newUser = new User({ firstName, lastName, email, password: hashedPassword });

  console.log("new User => ", newUser);

  newUser.save();

  res.location("/");
  res.json({
    statusCode: 200,
    message: "User was created",
    data: { user: newUser },
  });

  return res.send();
};

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("email :>> ", email);
  console.log("password :>> ", password);

  const fetchedUser = await User.exists({ email }).populate("password");

  // Checking a user with the email exists
  if (fetchedUser === null) {
    return res.status(404).send({
      statusCode: 404,
      message: "Email doesn't exist.",
    });
  }

  // TODO: REMOVE THIS SHIT
  // @ts-ignore
  const passwordsMatch = await bcrypt.compare(password, fetchedUser.password);

  console.log("fetchedUser :>> ", fetchedUser);
  console.log("email :>> ", email);
  console.log("passwordsMatch :>> ", passwordsMatch);

  if (passwordsMatch) {
    const secret = process.env.SECRET;
    if (!secret) {
      const error = new Error("Server error.");
      throw error;
    }
    const token = jwt.sign({ email: email, userId: fetchedUser._id.toString() }, secret);
    return res.json({ message: "Successful login", token: token });
  } else {
    return res.status(402).json({ message: "Invalid credentials" });
  }
};
