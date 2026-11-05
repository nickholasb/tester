# AI URL Safety Checker

A simple GitHub-ready template that connects a website frontend to a Node.js backend and optionally uses Google Gemini for a quick security summary.

This project is built for safe URL inspection and redirect checking. It does not bypass website protections or access restricted content.

## Features
- Validates input URL
- Checks whether the scheme is HTTP or HTTPS
- Inspects redirect chains
- Flags suspicious patterns, shorteners, and login-like paths
- Connects to Gemini AI for a security summary when `GEMINI_API_KEY` is configured

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment config:

```bash
cp .env.example .env
```

3. Add your Gemini API key in `.env`:

```bash
GEMINI_API_KEY=your_key_here
```

4. Start the app:

```bash
npm start
```

5. Open:

```text
http://localhost:3000
```

## API endpoint

```http
POST /api/check-url
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Example response:

```json
{
  "risk": "Low risk",
  "url": "https://example.com",
  "hostname": "example.com",
  "isHttps": true,
  "isSuspicious": false,
  "redirectCount": 1,
  "aiSummary": "This URL looks relatively safe..."
}
```

## Files
- `server.js` — Express server with validation and AI analysis
- `public/index.html` — frontend UI
- `public/styles.css` — styling
- `public/app.js` — browser logic
