import { config } from "dotenv";

config();

export const GMAIL_APP_PASSWORD = process.env.GMAIL_SMTP_PASSWORD!;