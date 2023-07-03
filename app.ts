import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import path from "path";
import bodyParser from "body-parser";
import { rootDir } from "./utils/path";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/auth", authRoutes);
app.use("/", (req: Request, res: Response) => {
  console.log("Hello!", rootDir);
  res.sendFile(path.join(rootDir, "view", "index.html"));
});

app.listen(port);
