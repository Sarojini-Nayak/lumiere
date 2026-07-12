import { Resend } from "resend";

// Render's free web services block outbound SMTP ports (25, 465, 587) —
// see https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports
// Resend sends over a normal HTTPS API call instead of SMTP, so it works
// fine on Render's free tier with no port restrictions to work around.
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL, // e.g. "Lumière <onboarding@resend.dev>" for testing, or your verified domain sender
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }
};

export default sendEmail;
