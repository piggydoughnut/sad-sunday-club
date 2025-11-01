# Mailgun Setup Instructions

This guide will help you connect the "Send me quiet things" form to Mailgun.

## Prerequisites

1. A Mailgun account (sign up at https://www.mailgun.com)
2. A verified domain in Mailgun (or use the sandbox domain for testing)
3. Your Mailgun API key

## Get Your Mailgun Credentials

1. Log in to your Mailgun dashboard
2. Go to **Sending** → **Domain Settings** (or use the sandbox domain for testing)
3. Note your domain name (e.g., `mg.yourdomain.com`)
4. Go to **Settings** → **API Keys**
5. Copy your Private API key

## Deployment to Vercel

### Steps:

1. **Push your code to GitHub** (if you haven't already)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect your settings

3. **Add Environment Variables:**
   - In your Vercel project, go to **Settings** → **Environment Variables**
   - Add these variables:
     - `MAILGUN_API_KEY` - Your Mailgun Private API key
     - `MAILGUN_DOMAIN` - Your Mailgun domain (e.g., `mg.yourdomain.com`)
     - `SUBSCRIBE_FROM_EMAIL` (optional) - Email to send from (default: `newsletter@${MAILGUN_DOMAIN}`)
     - `SUBSCRIBE_TO_EMAIL` (optional) - Email to receive subscriptions (default: `subscribe@${MAILGUN_DOMAIN}`)

4. **Deploy:**
   - After adding environment variables, redeploy your site (Vercel will do this automatically on next push, or click "Redeploy")
   - Your function will be available at `https://your-site.vercel.app/api/subscribe`

## Testing

1. Submit a test email through the form
2. Check your Mailgun dashboard → Sending → Logs to see if the email was sent
3. Check the email address set in `SUBSCRIBE_TO_EMAIL`

## Customization

You can customize the email content by editing the `api/subscribe.js` file:
- Change the subject line
- Modify the email body
- Add HTML formatting
- Add the subscriber to a Mailgun mailing list

## Troubleshooting

- **403 Forbidden**: Check your API key and domain
- **400 Bad Request**: Verify your domain is verified in Mailgun
- **CORS errors**: Make sure your API endpoint is correctly configured
- **Function not found**: Verify the function path matches your deployment platform

