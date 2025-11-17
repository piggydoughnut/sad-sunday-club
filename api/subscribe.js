// Vercel serverless function for Mailgun subscription
// Set environment variables in Vercel dashboard:
// MAILGUN_API_KEY, MAILGUN_DOMAIN, SUBSCRIBE_FROM_EMAIL, SUBSCRIBE_TO_EMAIL
import FormData from "form-data";
import Mailgun from "mailgun.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const fromEmail = process.env.SUBSCRIBE_FROM_EMAIL || `hello@${domain}`;
    const toEmail = process.env.SUBSCRIBE_TO_EMAIL || `subscribe@${domain}`;

    if (!apiKey || !domain) {
      console.error("Missing Mailgun configuration");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Initialize Mailgun client
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
      // Use EU endpoint if your domain is EU-based, otherwise use default US endpoint
      // url: "https://api.eu.mailgun.net" // Uncomment if using EU domain
    });

    // Send notification email to admin
    try {
      await mg.messages.create(domain, {
        from: `Sad Sunday Club <${fromEmail}>`,
        to: [toEmail],
        subject: "New Subscription",
        text: `New subscription from: ${email}`,
      });
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Mailgun API error (notification):", error);
      return res.status(500).json({
        error: error.message || "Failed to send notification email",
        details:
          "Check your Mailgun API key, domain, and that the domain is verified.",
      });
    }

    // Send welcome email to subscriber
    try {
      await mg.messages.create(domain, {
        from: `Sad Sunday Club <${fromEmail}>`,
        to: [email],
        subject: "Welcome to Sad Sunday Club",
        text: `Thank you for joining Sad Sunday Club.\n\nWe're not here to fix you. We're here to remind you that feeling is not a flaw.\n\nYou'll receive quiet things from time to time — small letters, drawings, thoughts, or gentle reminders that you're doing okay.\n\nWelcome to the club.`,
      });
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Mailgun API error (welcome email):", error);
      // If notification was sent but welcome failed, still return success
      // This might happen if using sandbox domain with unverified recipient
    }

    return res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || "An unexpected error occurred",
    });
  }
}
