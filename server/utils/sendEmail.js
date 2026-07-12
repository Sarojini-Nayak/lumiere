import nodemailer from "nodemailer";
import dns from "dns";

// Nodemailer has no working "force IPv4" option — passing `family: 4` to
// createTransport is silently ignored. Internally it resolves both A and
// AAAA records for the SMTP host and picks one at RANDOM on every connection
// (see lib/shared/index.js formatDNSValue). On Render's free tier, outbound
// IPv6 isn't routable, so roughly half of all sends failed with ENETUNREACH
// whenever it happened to pick an IPv6 address for smtp.gmail.com.
//
// Fix: resolve the IPv4 address ourselves and connect to that IP directly,
// while keeping `servername` set to the real hostname so TLS/STARTTLS
// certificate validation (and Gmail's SNI-based routing) still works.
const resolve4 = (hostname) =>
  new Promise((resolve, reject) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses?.length) return reject(err || new Error("No IPv4 address found"));
      resolve(addresses[0]);
    });
  });

const sendEmail = async (to, subject, html) => {
  const smtpHost = process.env.SMTP_HOST;
  const ipv4Address = await resolve4(smtpHost);

  const transporter = nodemailer.createTransport({
    host: ipv4Address,
    port: process.env.SMTP_PORT,
    secure: false,
    tls: {
      servername: smtpHost, // keep TLS validation/SNI tied to the real hostname
    },
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
