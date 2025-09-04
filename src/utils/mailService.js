import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail({ to, subject, title, message }) {
  return transporter.sendMail({
    from: `"Sheldon Global" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: `<h2>${title}</h2><p>${message}</p>`,
  });
}
