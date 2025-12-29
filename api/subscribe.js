// Mailgun subscription handler for Dokploy
// Set environment variables in Dokploy:
// MAILGUN_API_KEY, MAILGUN_DOMAIN, SUBSCRIBE_FROM_EMAIL, SUBSCRIBE_TO_EMAIL
// TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (optional - for Telegram notifications)
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { getWelcomeEmailHTML } from "../emails/welcome-email.js";

// Send Telegram notification (non-blocking)
async function sendTelegramNotification(email) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return; // Telegram not configured, silently skip
  }

  try {
    const message = `🎉 New subscription!\n\nEmail: ${email}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Telegram API error:", error);
    } else {
      console.log("Telegram notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    // Don't throw - we don't want Telegram failures to break subscriptions
  }
}

export async function subscribeHandler(req, res) {
  try {
    const { email, website } = req.body;

    // Honeypot check - if website field is filled, it's likely a bot
    if (website) {
      console.log("Bot detected: honeypot field filled");
      return res.status(400).json({ error: "Invalid request" });
    }

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

    // Initialize Mailgun client with EU endpoint
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
      url: "https://api.eu.mailgun.net", // EU endpoint
    });

    // Send welcome email to subscriber
    try {
      await mg.messages.create(domain, {
        from: `Sad Sunday Club <${fromEmail}>`,
        to: [email],
        subject: "Welcome to Sad Sunday Club",
        html: getWelcomeEmailHTML(),
        text: `Thank you for joining Sad Sunday Club.\n\nWe're not here to fix you. We're here to remind you that feeling is not a flaw.\n\nYou'll receive quiet things from time to time — small letters, drawings, thoughts, or gentle reminders that you're doing okay.\n\nWelcome to the club.`, // Plain text fallback
      });
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Mailgun API error (welcome email):", error);
      // If notification was sent but welcome failed, still return success
      // This might happen if using sandbox domain with unverified recipient
    }

    // Send Telegram notification (non-blocking)
    sendTelegramNotification(email).catch((error) => {
      console.error("Failed to send Telegram notification:", error);
    });

    return res.status(200).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || "An unexpected error occurred",
    });
  }
}
