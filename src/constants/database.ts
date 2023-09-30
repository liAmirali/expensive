import { config } from "dotenv";

config();

export const DB_SECRET = process.env.SECRET;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;