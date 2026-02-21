import nodemailer from "nodemailer";



export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other{edcedcedcedcedc{ qaz qaz qaz qaz qaz}}
  auth: {
    user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
  },
});

