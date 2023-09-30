import { config } from "dotenv";

config();

export const SERVER_ADDRESS = process.env.SERVER_ADDR;
export const CLIENT_ADDRESS = process.env.CLIENT_ADDR;