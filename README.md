# Reviome

**Reviome** (`https://reviome.in`) is an independent SaaS platform for local businesses to manage customer feedback, deploy contactless NFC & QR review touchpoints, and manage supported Google Business Profile review workflows.

---

## Features

- **Physical Contactless Touchpoints**: Dual NFC tap-to-open and high-resolution QR codes directing customers to your review destination.
- **Google Business Profile Integration**: Secure OAuth 2.0 authorization with automated token refresh, location discovery, and review synchronization.
- **Review Dashboard**: Unified inbox for Google reviews with status tracking, sentiment trends, and unanswered review alerts.
- **AI-Assisted Reply Drafting**: Contextual reply suggestions to help merchants respond to customer reviews promptly.
- **Customer Feedback Channel**: Direct feedback flow for resolving customer issues before public escalation.
- **Analytics & Growth Score**: Real-time telemetry on in-person tap counts, scan frequency, and localized reputation metrics.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Database & ORM**: [PostgreSQL](https://neon.tech) + [Prisma ORM](https://www.prisma.io)
- **Authentication**: [Auth.js / NextAuth v5](https://authjs.dev)
- **Icons**: [Lucide React](https://lucide.dev)

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/spidy7878/reviome.git
cd reviome
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

Set the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `AUTH_SECRET`: A 32+ character random string for session tokens.
- `NEXTAUTH_URL`: Canonical site URL (e.g. `http://localhost:3000` or `https://reviome.in`).
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials from Google Cloud Console.
- `TOKEN_ENCRYPTION_KEY`: A 64-character hex string (32 bytes) for AES-256-GCM token encryption.

### 3. Initialize Database

```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Third-Party Notice

Reviome is an independent third-party software service. Google and Google Business Profile are registered trademarks of Google LLC. Reviome is not affiliated with, endorsed by, certified by, or in official partnership with Google LLC.
