import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";

import apiBaseRouter from "./routes";

import { rootDir } from "./utils/path";
import { databaseUri } from "./utils/database";

import { config } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { defaults } from "./middlewares/defaults";

// Loading the .env file
config();

const app = express();
const port = 5000;

// Setting up the body parser
app.use(bodyParser.json());
// Making the public directory a static directory
app.use(express.static(path.join(rootDir, "public")));
// Setting some default settings on the request and response
app.use(defaults);

app.use("/api", apiBaseRouter);

// Error handler
app.use(errorHandler);

mongoose
  .connect(databaseUri)
  .then(() => {
    console.log("App successfully started!");
    app.listen(port);
  })
  .catch((err) => {
    console.log("Error in connecting to the database: ", err);
  });
