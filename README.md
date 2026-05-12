# ResumeAI Pro

AI-powered resume builder tailored to fresher / intermediate / professional candidates.

Built with **Next.js 14**, **Supabase** (auth + Postgres + RLS), **Tailwind**, and a deterministic mock-AI engine that produces realistic GPT-4o-style output without needing an API key.

> Stripe and Resend are stubbed by default (`MOCK_PAYMENTS=true`). Real keys can be plugged in later — the code paths are isolated.

---

## Quick start

### 1. Clone & install
```bash
git clone https://github.com/khuzaimabutt/resumeai-pro.git
cd resumeai-pro
npm install
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com), create a new project
2. In the SQL editor, paste & run `supabase/migrations/0001_init.sql`
3. Project Settings → API → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure env
```bash
cp .env.example .env.local
# fill in the three Supabase values above
```

### 4. Run
```bash
npm run dev
```

Open http://localhost:3000.

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | for PDF render route |
| `NEXT_PUBLIC_APP_URL` | optional | full URL once deployed |
| `MOCK_AI` | default `true` | flips on the deterministic mock generator |
| `MOCK_PAYMENTS` | default `true` | flips on the in-app fake checkout |
| `PDF_FETCH_TOKEN` | optional | shared secret to gate `/resume-pdf/:id` |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → "Add new project" → import the repo
3. Add the same env vars from `.env.local`
4. Deploy

PDF generation uses `@sparticuz/chromium` on Vercel (no extra config needed). Locally it falls back to a system Chrome install.

---

## Project structure

```
app/                 Next.js App Router
  page.tsx           Landing page
  (auth)/            login, signup
  (app)/             dashboard, builder, preview, settings, pricing
  api/               REST endpoints
  resume-pdf/[id]    Headless render target for Puppeteer
components/          Reusable UI
lib/
  supabase/          client + server clients
  ai/mock.ts         Deterministic resume generator
  pdf/generate.ts    Puppeteer wrapper
supabase/migrations/ SQL schema + RLS policies
middleware.ts        Auth-protect /dashboard, /builder, /preview, /settings
```

---

## Plugging in real services

- **Real OpenAI**: replace `mockGenerate()` in `lib/ai/mock.ts` with an OpenAI call. The signature stays the same.
- **Real Stripe**: set `MOCK_PAYMENTS=false` and implement Stripe Checkout in `app/api/payments/checkout/route.ts`.
- **Real Resend**: replace the `email_logs` insert in `app/api/resumes/[id]/generate/route.ts` with a Resend send call.

---

MIT
