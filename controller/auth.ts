import { Request, Response } from "express";
import { User } from "../models/User";
import { ResError } from "../models/ResError";
import bcrypt from "bcryptjs";

export const postRegister = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const message = "Name, email and password field are required!";
    console.error(message);

    return res.status(400).send(ResError(400, message));
  }

  const existingUser = await User.exists({ email: email });

  if (existingUser !== null) {
    const message = "User with this email already exists";
    console.error(message);

    return res.status(400).send(ResError(400, message));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({ name, email, password: hashedPassword });

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

  const fetchedUser = await User.exists({ email }).populate("password");

  if (fetchedUser === null) {
    return res.send({
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
    return res.json({ message: "Successful login" });
  } else {
    return res.json({ message: "Invalid credentials" });
  }
};
