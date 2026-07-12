import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    family: 4, // Force IPv4 — Render's outbound network can't route to Gmail's IPv6 address
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Lumière" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
