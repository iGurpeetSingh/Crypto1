# Crypto1 — Cloudflare Workers backend

Crypto1 uses React + Vite for its frontend and Cloudflare Workers + D1 for its backend.

## Backend included

- Worker API routes for health, email OTP development flow, user profile, logout, demo wallet, simulated spot orders, positions and order history.
- D1 schema for users, OTP records, sessions, demo USD wallet, crypto positions and trade history.
- Hashed OTP storage, 5-minute OTP expiry, 60-second resend cooldown and a five-attempt limit.
- Hashed bearer session tokens with seven-day expiry.
- Demo BUY/SELL ledger with a 0.1% simulated fee.
- No exchange, email, payment gateway or external market-data API is called by the Worker.

## What does not work without an external provider

- **Real email OTP:** an email delivery service is required to send a code to Gmail. The Worker only exposes a development OTP in local development mode; it never returns a code in production.
- **Real deposits or withdrawals:** a payment gateway and merchant verification are required. Payment endpoints explicitly return a disabled response; the demo wallet is not real money.
- **Real crypto execution and live prices:** an exchange/market-data integration and credentials are required. Demo trades are simulated and are not exchange orders.

## Local development

Requirements: Node.js 20.19+ or 22.12+.

1. Install dependencies: `npm install`.
2. Sign in to Cloudflare: `npx wrangler login`.
3. Create a D1 database: `npm run db:create`.
4. Copy the generated database ID into `wrangler.toml`, replacing `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID`.
5. Apply the D1 schema: `npm run db:migrate:remote`.
6. Create an untracked `.dev.vars` file:
   ```
   ENVIRONMENT=development
   ALLOW_DEV_OTP=true
   ```
7. Terminal 1: `npm run worker:dev` (Worker on port 8787).
8. Terminal 2: `npm run dev` (Vite proxies `/api/*` to the Worker).

The development OTP is displayed in the app only when running the Worker with `ALLOW_DEV_OTP=true` and `ENVIRONMENT=development`. Do not use that mode on a public deployment.

## Production Worker deployment

1. Ensure the D1 database ID is set in `wrangler.toml`.
2. Keep `ENVIRONMENT=production` and `ALLOW_DEV_OTP=false`.
3. Deploy with `npm run worker:deploy`.
4. Configure `VITE_API_BASE_URL` in the frontend build environment to the deployed Worker URL, then rebuild/redeploy the frontend.

The current Vercel frontend is not automatically connected to the Worker until `VITE_API_BASE_URL` is set to the deployed Worker URL. Worker deployment and D1 creation require the repository owner to authenticate Wrangler with Cloudflare.

## Scripts

- `npm run worker:dev` — run local Worker.
- `npm run worker:deploy` — deploy Worker.
- `npm run db:create` — create D1 database.
- `npm run db:migrate:local` — apply migrations locally.
- `npm run db:migrate:remote` — apply migrations to Cloudflare D1.
