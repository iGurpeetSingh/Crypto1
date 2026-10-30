# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

 
## Production authentication and payments setup

The frontend now calls same-origin Vercel serverless endpoints for email OTP and Razorpay checkout. These integrations remain disabled until the backend configuration is completed.

### 1. Database

Create a Supabase project, open **SQL Editor**, and run the complete contents of `database/schema.sql`. The schema creates:
- verified user profiles,
- expiring email OTP records,
- Razorpay payment orders,
- an idempotent wallet-credit function.

Keep the Supabase service-role key on the server only. Never expose it in a `VITE_*` variable or frontend code.

### 2. Vercel environment variables

Add these variables in **Vercel → Project → Settings → Environment Variables** for Production (and Preview/Development when needed):

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service role key |
| `APP_SESSION_SECRET` | Random 32+ character secret used to sign sessions and hash OTP codes |
| `RESEND_API_KEY` | Resend API key for sending email OTP |
| `EMAIL_FROM` | Sender address on a domain verified in Resend |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Server-only Razorpay secret |

After saving the variables, redeploy the project. The sender domain must be verified with Resend and Razorpay must be activated for the merchant account. OTP codes expire after five minutes and are limited to five verification attempts per issued code.

### 3. Payments

The Wallet page creates INR Razorpay orders server-side and credits the account only after the payment signature and captured payment status are verified server-side. Supported deposit amount is ₹100–₹5,00,000. Test with Razorpay test-mode credentials before enabling live mode.

### 4. Trading mode

Spot market orders and limit orders currently operate against the local simulated trading ledger. Pending limit orders and stop-loss/take-profit checks are evaluated while the browser app is open and market quotes refresh. This is not a production exchange matching engine, does not guarantee execution at a target price, and must not be used to custody or trade real crypto assets.

 
## Cloudflare Workers backend (no paid external API required for demo mode)

The backend source is in `worker/index.js`; D1 schema migration is in `migrations/0001_initial.sql`. It provides health, email-OTP development flow, profile, demo wallet, demo trading orders, positions, and trade history endpoints.

### What works without external API credentials

- Cloudflare Worker API runtime and D1 persistence.
- Local-only development OTP flow (the code is returned by the API response for testing).
- User registration/login and expiring bearer sessions in D1.
- Demo USD wallet, crypto positions, simulated buy/sell orders and history.
- Profile read/update and session logout.
- No exchange, mail, payment gateway, or market-data provider is called by this backend.

**Security restriction:** Development OTP mode is disabled in `wrangler.toml` for production. Never enable `ALLOW_DEV_OTP` or expose development OTP responses on a public production URL. A real email OTP cannot be delivered without an email delivery service. A real payment cannot be collected without a payment provider. A real exchange order cannot be executed without an exchange integration and credentials. Demo balances are not money and simulated orders are not real trades.

### Run locally

1. Install Node.js (20.19+ or 22.12+) and dependencies: `npm install`.
2. Sign in to Cloudflare from your terminal: `npx wrangler login`.
3. Create the D1 database: `npm run db:create`.
4. Copy the returned database ID into `wrangler.toml`, replacing `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID`.
5. Apply the schema: `npm run db:migrate:remote`.
6. Create a local-only `.dev.vars` file containing:
   `ENVIRONMENT=development`
   `ALLOW_DEV_OTP=true`
   `SESSION_SECRET=use-a-long-random-local-development-secret`
7. Start the Worker: `npm run worker:dev`.

Do not commit `.dev.vars`. It is excluded by `.gitignore`.

### Deploy

Set a strong `SESSION_SECRET` with Wrangler secrets, keep `ENVIRONMENT=production` and `ALLOW_DEV_OTP=false`, then run `npm run worker:deploy`. Set a custom Worker domain or use the assigned `workers.dev` URL. The current Vercel frontend still needs its `/api/*` requests routed to that deployed Worker URL before it uses this backend in production.
