import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use("/", (req: Request, res: Response) => {
  console.log("Hello!");
  res.write("YO YOOOO");
  res.send();
});

app.listen(port);