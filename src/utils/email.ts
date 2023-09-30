import { config } from "dotenv";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";
import { GMAIL_APP_PASSWORD } from "../constants/email";

config();

const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: "the.expensive.app@gmail.com",
    pass: GMAIL_APP_PASSWORD,
  },
};

export const sendEmail = async (mailOptions: MailOptions) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);
  const res = await transporter.sendMail({
    from: "the.expensive.app@gmail.com",
    sender: "Expensive Support",
    ...mailOptions,
  });
  console.log("res :>> ", res);
};
