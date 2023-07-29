import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";

import apiBaseRouter from "./routes";

import { rootDir } from "./utils/path";
import { databaseUri } from "./utils/database";

import { config } from "dotenv";

// Loading the .env file
config();

const app = express();
const port = 5000;

// Setting up the body parser
app.use(bodyParser.json());
// Making the public directory a static directory
app.use(express.static(path.join(rootDir, "public")));

app.use("/api", apiBaseRouter);

mongoose
  .connect(databaseUri)
  .then(() => {
    console.log("App successfully started!");
    app.listen(port);
  })
  .catch((err) => {
    console.log("Error in connecting to the database: ", err);
  });
