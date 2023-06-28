import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes);

app.use("/", (req: Request, res: Response) => {
  console.log("Hello!");
  res.sendFile(path.join(__dirname, "..", "view", "index.html"));
});

app.listen(port);
