import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ApiError, ApiRes } from "../utils/responses";

config();

export const postRegister = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.exists({ email: email });

  // Checking if a user with the entered email exists
  if (existingUser !== null) {
    throw new ApiError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Creating the user model
  const newUser = new User({ firstName, lastName, email, password: hashedPassword });

  console.log("new User => ", newUser);

  await newUser.save();

  return res.json(new ApiRes("User was registered successfully.", { user: newUser }));
};

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("email :>> ", email);
  console.log("password :>> ", password);

  const fetchedUser = await User.findOne({ email }).select("-__v");

  // Checking a user with the email exists
  if (fetchedUser === null) {
    throw new ApiError("Email doesn't exist.", 404);
  }

  console.log("fetchedUser :>> ", fetchedUser);

  // TODO: REMOVE THIS SHIT
  // @ts-ignore
  const passwordsMatch = await bcrypt.compare(password, fetchedUser.password);

  console.log("email :>> ", email);
  console.log("passwordsMatch :>> ", passwordsMatch);

  if (passwordsMatch) {
    const secret = process.env.SECRET;
    if (!secret) {
      const error = new Error("Server error.");
      throw error;
    }
    const accessToken = jwt.sign({ email: email, userId: fetchedUser._id.toString() }, secret);

    (fetchedUser.password as string | undefined) = undefined; // Removing the password field from the response
    return res.json(new ApiRes("Successful login", { accessToken, user: fetchedUser }));
  } else {
    throw new ApiError("Invalid credentials.", 402);
  }
};

export const verifyAccessToken = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).select("-password -__v");
  if (user === null) {
    throw new ApiError("No user was found.", 401);
  }

  return res.json(new ApiRes("Access token is verified.", { user: user }, 200));
};
