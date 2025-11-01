# Serverless Functions Explained

## What is netlify.toml?

The `netlify.toml` file is a configuration file that tells Netlify:
- Where to find your serverless functions (`functions = "netlify/functions"`)
- How to route requests (redirects `/api/subscribe` to the actual function)

## Do you need a server function?

**Yes, but it's not a traditional server!** You need a **serverless function** because:

1. **Security**: Your Mailgun API key must be kept secret. If you put it in the browser code, anyone could see it.
2. **Server-side only**: Mailgun API calls need to happen on a server, not in the browser.
3. **No server to manage**: Serverless functions run automatically when called - you don't need to set up or maintain a server.

## How it works:

1. **User submits form** → Browser sends request to `/api/subscribe`
2. **netlify.toml redirects** → `/api/subscribe` → `/.netlify/functions/subscribe`
3. **Netlify runs function** → `netlify/functions/subscribe.js` executes on Netlify's servers
4. **Function calls Mailgun** → Uses your secret API key (stored as environment variable)
5. **Emails are sent** → Welcome email to subscriber, notification to you

## Deployment Options:

### Option 1: Netlify (Current Setup)
- Function file: `netlify/functions/subscribe.js`
- Config: `netlify.toml` 
- Deploy: Connect your repo to Netlify, set environment variables

### Option 2: Vercel
- Function file: `api/subscribe.js` (already exists)
- Config: `vercel.json` (already exists)
- Deploy: Connect repo to Vercel, set environment variables

Both work the same way - just different platforms with slightly different file structures.

## What you need to do:

1. Choose Netlify OR Vercel
2. Deploy your site to that platform
3. Add environment variables (Mailgun API key, domain, etc.)
4. That's it! The function will work automatically.

