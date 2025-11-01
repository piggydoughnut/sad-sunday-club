// Vercel serverless function for Mailgun subscription
// Set environment variables in Vercel dashboard:
// MAILGUN_API_KEY, MAILGUN_DOMAIN, SUBSCRIBE_FROM_EMAIL, SUBSCRIBE_TO_EMAIL
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const fromEmail = process.env.SUBSCRIBE_FROM_EMAIL || `newsletter@${domain}`;
    const toEmail = process.env.SUBSCRIBE_TO_EMAIL || `subscribe@${domain}`;

    if (!apiKey || !domain) {
      console.error('Missing Mailgun configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Send notification email to admin
    const notificationFormData = new URLSearchParams();
    notificationFormData.append('from', `Sad Sunday Club <${fromEmail}>`);
    notificationFormData.append('to', toEmail);
    notificationFormData.append('subject', 'New Subscription');
    notificationFormData.append('text', `New subscription from: ${email}`);

    const notificationResponse = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
      },
      body: notificationFormData
    });

    if (!notificationResponse.ok) {
      const errorText = await notificationResponse.text();
      console.error('Mailgun API error:', errorText);
      return res.status(500).json({ error: 'Failed to send notification email' });
    }

    // Send welcome email to subscriber
    const welcomeFormData = new URLSearchParams();
    welcomeFormData.append('from', `Sad Sunday Club <${fromEmail}>`);
    welcomeFormData.append('to', email);
    welcomeFormData.append('subject', 'Welcome to Sad Sunday Club');
    welcomeFormData.append('text', `Thank you for joining Sad Sunday Club.\n\nWe're not here to fix you. We're here to remind you that feeling is not a flaw.\n\nYou'll receive quiet things from time to time — small letters, drawings, thoughts, or gentle reminders that you're doing okay.\n\nWelcome to the club.`);

    const welcomeResponse = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
      },
      body: welcomeFormData
    });

    if (!welcomeResponse.ok) {
      const errorText = await welcomeResponse.text();
      console.error('Mailgun API error (welcome email):', errorText);
      // Still return success if notification was sent
    }

    return res.status(200).json({ message: 'Subscription successful' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


