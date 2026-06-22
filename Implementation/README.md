## Testing the contact form

The contact form sends email through the Vercel serverless function at `/api/contact`.
For local development, Vite proxies `/api/contact` to `http://localhost:8787/api/contact`.

Before testing, make sure the Vercel project has this environment variable set:

```txt
RESEND_API_KEY=re_...
```

These variables are optional because the API has defaults for the new domain:

```txt
RESEND_FROM=Green Earth Produce <contact@greenearthproducebv.eu>
CONTACT_EMAIL_TO=greenearthprdoucebv@gmail.com
```

### Local browser test

From `Implementation`, start the local API server:

```powershell
npm run dev:api
```

In another terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

Then open the local Vite URL, usually `http://localhost:5173/contact`.

1. Fill in the required fields: name, email, subject, and message.
2. Submit the form.
3. Confirm the page shows `Message sent successfully. We will get back to you soon.`
4. Check the `greenearthprdoucebv@gmail.com` inbox.

If the form says `Network error` locally, make sure `npm run dev:api` is still running on port `8787`.

### Deployed browser test

1. Open `https://greenearthproducebv.eu/contact`.
2. Fill in the required fields: name, email, subject, and message.
3. Submit the form.
4. Confirm the page shows `Message sent successfully. We will get back to you soon.`
5. Check the `greenearthprdoucebv@gmail.com` inbox.
6. If it fails, open Vercel Dashboard, go to the project logs, submit the form again, and check the `/api/contact` function error.

### Direct deployed API test

You can also test the deployed API from PowerShell:

```powershell
$body = @{
  name = "Test User"
  email = "test@example.com"
  subject = "General question"
  message = "Testing the Resend contact form."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://greenearthproducebv.eu/api/contact" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

A working response should be:

```json
{
  "ok": true
}
```

## Newsletter setup with Supabase + Resend + double opt-in

The newsletter form on the About page is now designed for Supabase Edge Functions instead of the old `/api/subscribe` Vercel flow.

### What this setup does

1. The About page submits the email address to the Supabase Edge Function `newsletter-subscribe`.
2. The function stores the address in `public.newsletter_subscribers` with status `pending`.
3. The function sends a confirmation email through Resend.
4. The confirmation link opens `/newsletter/confirm` in the frontend.
5. That page calls the Edge Function `newsletter-confirm`, which marks the subscriber as `confirmed`.

### 1. Run the database migration

Apply the new migration in `supabase/migrations/20260610_create_newsletter_subscribers.sql`.

If you use the Supabase CLI:

```bash
supabase db push
```

Or paste the SQL into the Supabase SQL Editor and run it there.

### 2. Set Edge Function secrets

Set these secrets in Supabase:

```txt
RESEND_API_KEY=re_...
RESEND_FROM=Green Earth Produce <newsletter@your-domain>
SITE_URL=https://greenearthproducebv.eu
NEWSLETTER_CONFIRM_TTL_HOURS=48
```

`SITE_URL` must point to the public frontend domain where `/newsletter/confirm` is reachable.

With the CLI:

```bash
supabase secrets set --env-file .env.local
```

Or set them individually in the Supabase Dashboard under Edge Functions secrets.

### 3. Deploy the Edge Functions

This repo includes two functions:

- `newsletter-subscribe`
- `newsletter-confirm`

Deploy them with JWT verification disabled, because the browser calls them without a logged-in Supabase user:

```bash
supabase functions deploy newsletter-subscribe --no-verify-jwt
supabase functions deploy newsletter-confirm --no-verify-jwt
```

If your local repo is not linked yet:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Frontend requirements

The frontend still needs:

```txt
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

These values are used in `frontend/src/lib/supabase.ts` so the browser can invoke the Edge Functions.

### 5. Local testing

Start the frontend:

```bash
cd frontend
npm run dev
```

Serve the functions locally from `Implementation`:

```bash
supabase start
supabase functions serve newsletter-subscribe --no-verify-jwt --env-file .env.local
supabase functions serve newsletter-confirm --no-verify-jwt --env-file .env.local
```

Then test the flow:

1. Open the About page locally.
2. Submit an email in the newsletter box.
3. Check that a row is created in `newsletter_subscribers` with status `pending`.
4. Open the confirmation link from the email.
5. Check that the row changes to `confirmed`.

### Notes

- No Supabase Auth user is required for this flow.
- The subscriber list lives in Supabase, Resend is only used to send the email.
- The existing `api/subscribe.ts` file is no longer the primary newsletter path for the Supabase-hosted site.
