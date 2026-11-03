# CryptoDash Brevo Gmail OTP setup

The app sends OTP messages through Brevo's transactional email API from Vercel server-side functions. The Brevo API key is never exposed to the browser.

## Vercel environment variables

Add these under Project → Settings → Environment Variables, for Production and Preview as needed:

- `BREVO_API_KEY`: Brevo API key (not the SMTP password)
- `BREVO_SENDER_EMAIL`: an email sender verified in Brevo
- `BREVO_SENDER_NAME`: optional; defaults to `CryptoDash`
- `SUPABASE_URL`: existing Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: existing server-only Supabase service-role key
- `APP_SESSION_SECRET`: existing random server secret used to HMAC OTPs (keep at least 32 characters)

Do not put any of these values in `VITE_*` variables or commit them to Git.

## Brevo setup

1. In Brevo, create an API key from SMTP & API → API Keys.
2. Verify the sender email and authenticate the sending domain (DNS records such as DKIM).
3. Add the API key and verified sender email to Vercel environment variables.
4. Redeploy the Vercel project after saving environment variables.

## OTP behavior

- Gmail-only addresses are accepted by the demo entry screen.
- Codes are six digits and expire after five minutes.
- A new code cannot be requested for the same email within 60 seconds.
- The database stores only an HMAC hash of the code, never the raw OTP.
- Failed verification attempts are counted in the database and capped at five.
- A verified OTP is deleted after successful use.
- The code uses the existing Supabase `auth_otps` table and server-only service-role key.

## API routes

- `POST /api/auth/request-otp` — send OTP using Brevo.
- `POST /api/auth/verify-otp` — verify OTP and consume it.
- `POST /api/auth/send-otp` — compatibility alias for request-otp.

Brevo endpoint: `POST https://api.brevo.com/v3/smtp/email`.
