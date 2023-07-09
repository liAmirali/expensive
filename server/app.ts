import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import path from "path";
import bodyParser from "body-parser";
import { rootDir } from "./utils/path";
import { dbConnect } from "./utils/database";

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/auth", authRoutes);
app.use("/", (req: Request, res: Response) => {
  console.log("Hello!", rootDir);
  res.sendFile(path.join(rootDir, "view", "index.html"));
});

dbConnect().catch(console.dir);

app.listen(port);
