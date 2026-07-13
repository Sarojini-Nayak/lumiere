// Sends email via Brevo's HTTPS API instead of raw SMTP. Render's free tier
// blocks outbound traffic on SMTP ports (25, 465, 587) entirely — this is a
// hard network-level restriction on their end, confirmed in Render's own
// changelog, not something fixable from our code. Brevo's API runs over
// HTTPS (port 443), which isn't blocked, since blocking it would break
// every outbound web request the app makes.
const sendEmail = async (to, subject, html) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Lumière", email: process.env.SMTP_USER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
};

export default sendEmail;
