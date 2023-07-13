import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";

import authRoutes from "./routes/auth";

import { rootDir } from "./utils/path";
import { databaseUri } from "./utils/database";

import { config } from "dotenv";

// Loading the .env file
config();

const app = express();
const port = 5000;

// Setting up the body parser
app.use(bodyParser.urlencoded({ extended: false }));
// Making the public directory a static directory
app.use(express.static(path.join(rootDir, "public")));
// Setting up the session middleware
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRoutes);

mongoose
  .connect(databaseUri)
  .then(() => {
    console.log("App successfully started!");
    app.listen(port);
  })
  .catch((err) => {
    console.log("Error in connecting to the database: ", err);
  });
