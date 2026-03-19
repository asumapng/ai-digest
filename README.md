# AI Pulse: Daily Technical Intelligence

A beautiful, 3D-enhanced web application that scrapes, summarizes, and emails the latest news in Analytics, DS, ML, and DE.

## Tech Stack
-   **Frontend**: Next.js (App Router), Three.js (@react-three/fiber), Stitches (@stitches/react).
-   **Backend**: Node.js, RSS Parser, Cheerio, Gemini AI (@google/generative-ai).
-   **Database**: SQLite (better-sqlite3).
-   **Mailing**: Nodemailer.

## Setup

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Choice of Resend or SMTP)
RESEND_API_KEY=re_123456789 # If using Resend

# SMTP (Fallback if RESEND_API_KEY is not set)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Daily Newsletter (Scraper + Email)
To run the scraper and send the newsletter, execute the script:
```bash
npx tsx scripts/daily_newsletter.ts
```

## Scheduling (9 AM Daily)
To automate this at 9 AM, add a cron job on your server or local machine:
```cron
0 9 * * * cd /path/to/newsletter_ai && npx tsx scripts/daily_newsletter.ts >> /tmp/newsletter.log 2>&1
```

## Project Structure
-   `src/app`: Next.js pages and API routes.
-   `src/components`: UI components (3D scene, forms, news feed).
-   `src/lib`: Core logic (Scraper, AI, DB, Mailer).
-   `scripts/`: Automation scripts.
