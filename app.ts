import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";

import authRoutes from "./routes/auth";

import { rootDir } from "./utils/path";
import { databaseUri } from "./utils/database";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

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
