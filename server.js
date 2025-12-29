// Load environment variables from .env file in development
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { subscribeHandler } from "./api/subscribe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allow inline scripts for Google Analytics
          "https://www.googletagmanager.com",
          "https://cdn.tailwindcss.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Allow inline styles
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://www.googletagmanager.com"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
        ],
      },
    },
  })
);
app.use(cors());
app.use(express.json());

// Rate limiting for subscription endpoint
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many subscription attempts, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// API routes (must come before static file serving)
app.post("/api/subscribe", subscribeLimiter, subscribeHandler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files (images, CSS, JS, etc.)
app.use("/images", express.static(join(__dirname, "images")));

// Serve entry pages directory
app.use("/entries", express.static(join(__dirname, "entries")));

// Serve static assets (CSS, JS files if any) from root
app.use(
  express.static(__dirname, {
    extensions: ["html", "css", "js"],
    index: false, // Don't auto-serve index.html for directories
  })
);

// Serve HTML pages with explicit routes
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(join(__dirname, "about.html"));
});

app.get("/about.html", (req, res) => {
  res.sendFile(join(__dirname, "about.html"));
});

// Fallback: serve index.html for any unmatched routes (SPA-style)
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
