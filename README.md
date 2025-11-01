# Sad Sunday Club

A quiet place for people who feel things deeply. A simple, elegant static website built with Tailwind CSS.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `MAILGUN_API_KEY` - Your Mailgun Private API key
   - `MAILGUN_DOMAIN` - Your Mailgun domain
   - `SUBSCRIBE_FROM_EMAIL` (optional) - Email to send from
   - `SUBSCRIBE_TO_EMAIL` (optional) - Email to receive subscriptions
4. Deploy!

See [MAILGUN_SETUP.md](./MAILGUN_SETUP.md) for detailed Mailgun configuration instructions.

## Email Subscription

The subscription form sends:
- **Welcome email** to the subscriber
- **Notification email** to you with the subscriber's email

All handled via Mailgun through the Vercel serverless function at `/api/subscribe`.


## License

Made by a human, for humans.
