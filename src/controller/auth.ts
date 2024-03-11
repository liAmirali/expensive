import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError, ApiRes } from "../utils/responses";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import { DB_SECRET } from "../constants/database";
import { CLIENT_ADDRESS } from "../constants/addresses";
import { matchedData } from "express-validator";

export const postRegister = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  const existingUser = await User.exists({ email: email });

  // Checking if a user with the entered email exists
  if (existingUser !== null) {
    throw new ApiError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Creating the user model
  const newUser = new User({ name, username, email, password: hashedPassword });

  await newUser.save();

  return res.json(new ApiRes("User was registered successfully.", { user: newUser }));
};

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const fetchedUser = await User.findOne({ email }).select("password").select("-__v");

  // Checking a user with the email exists
  if (fetchedUser === null) {
    throw new ApiError("Email doesn't exist.", 404);
  }

  // TODO: REMOVE THIS SHIT
  // @ts-ignore
  const passwordsMatch = await bcrypt.compare(password, fetchedUser.password);

  if (passwordsMatch) {
    if (!DB_SECRET) {
      const error = new Error("Server error.");
      throw error;
    }
    const accessToken = jwt.sign({ email: email, userId: fetchedUser._id.toString() }, DB_SECRET);

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

export const requestResetPassword = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("No valid user was found.", 401);
  }

  const resetTokenBuffer = crypto.randomBytes(32);

  const resetToken = resetTokenBuffer.toString("hex");

  user.resetPassToken = resetToken;
  user.resetPassTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour from now

  await user.save();

  const resetPasswordLink = `${CLIENT_ADDRESS}/auth/reset-password?token=${resetToken}`;

  sendEmail({
    to: user.email,
    subject: "Password Reset | Expensive",
    text: `Hey it looks like you requested to reset your password. Here's the link, go ahead and copy it in your browser address bar: ${resetPasswordLink}`,
    html: `Hey it looks like you requested to reset your password. \
    Here's the link: <a href="${resetPasswordLink}">Rest Password</a>\
    <br />\
    If you can't open the link, copy and paste this link inside your browser address bar:<br />\
    ${resetPasswordLink}<br />\
    This link will be <strong>expired in 1 hour</strong>.`,
  });

  return res.json(new ApiRes("Password reset request was successful."));
};

export const resetPassword = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { newPassword, resetToken } = matchedData(req) as {
    newPassword: string;
    resetToken: string;
  };

  const user = await User.findById(userId)
    .populate("resetPassToken resetPassTokenExpiration")
    .select("+resetPassToken +resetPassTokenExpiration");
  if (!user) {
    throw new ApiError("User was not found.", 401);
  }

  if (
    !user.resetPassToken ||
    user.resetPassToken !== resetToken ||
    !user.resetPassTokenExpiration
  ) {
    throw new ApiError("Reset Password Token is not valid.", 403);
  }

  if (user.resetPassTokenExpiration < Date.now()) {
    throw new ApiError("Reset Password Token is expired.", 403);
  }

  user.resetPassToken = undefined;
  user.resetPassTokenExpiration = undefined;

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  return res.json(new ApiRes("Password was reset successfully."));
};

export const requestEmailVerification = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found.", 403);
  }

  if (user.isEmailVerified) {
    throw new ApiError("Email is already verified", 403);
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour from now

  await user.save();

  const clientRedirectUrl = `${CLIENT_ADDRESS}/auth/verify-email?token=${emailVerificationToken}`;

  sendEmail({
    to: user.email,
    subject: "Email Verification | Expensive",
    text: `Please verify your email by copying this link into your browser address bar: ${clientRedirectUrl}`,
    html: `Please verify your email. Click <a href="${clientRedirectUrl}">this link</a> or copy this link into your browser address bar.<br>${clientRedirectUrl}.`,
  });

  return res.json(new ApiRes("Email verification code was sent successfully."));
};

export const verifyEmail = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { verifyEmailToken } = matchedData(req);

  const user = await User.findById(userId).populate("emailVerificationToken emailVerificationTokenExpiration");
  if (!user) {
    throw new ApiError("User not found.", 403);
  }

  if (!user.emailVerificationToken || user.emailVerificationToken !== verifyEmailToken) {
    throw new ApiError("Verification token is not valid.", 403);
  }

  if (
    !user.emailVerificationTokenExpiration ||
    user.emailVerificationTokenExpiration < Date.now()
  ) {
    throw new ApiError("Verification token is expired.", 403);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiration = undefined;
  await user.save();

  return res.json(new ApiRes("Email was verified successfully."));
};
