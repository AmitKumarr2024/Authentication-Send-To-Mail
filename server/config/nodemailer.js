import nodemailer from "nodemailer";
import { SMTP_PASS, SMTP_USER } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // Use STARTTLS
  auth: {
    user: SMTP_USER, // 83d15e001@smtp-brevo.com
    pass: SMTP_PASS, // your SMTP API key
  },
});


export default transporter;
