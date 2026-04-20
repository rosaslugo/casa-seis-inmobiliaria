# Deployment Guide — Casa Seis Inmobiliaria

## Prerequisites
- Node.js 18+
- Supabase project (schema applied)
- Google Maps API key (Maps JavaScript API enabled)
- Domain pointed to Vercel (optional for production)

---

## Vercel (Recommended)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel            # Preview deploy
vercel --prod     # Production deploy
```

### 3. Environment Variables in Vercel
Go to: **Project → Settings → Environment Variables**

| Variable | Environment |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | All |
| `NEXT_PUBLIC_SITE_URL` | Production |
| `REVALIDATION_SECRET` | Production |

### 4. Domain setup
Add your custom domain in Vercel → Settings → Domains.
Update `NEXT_PUBLIC_SITE_URL` to `https://casaseis.mx`.

---

## Supabase Production Checklist

- [ ] Enable RLS on all tables (already in schema.sql)
- [ ] Rotate API keys if exposed
- [ ] Enable `pgaudit` for query logging
- [ ] Set up daily automated backups
- [ ] Add custom SMTP for auth emails (Supabase → Auth → SMTP)
- [ ] Restrict `service_role` key to server-only use
- [ ] Enable Supabase Edge Functions for webhooks (optional)

---

## Google Maps API Security
1. In Google Cloud Console → APIs & Services → Credentials
2. Edit your API key → **Application restrictions** → HTTP referrers
3. Add: `https://casaseis.mx/*` and `https://*.vercel.app/*`
4. **API restrictions** → Maps JavaScript API only

---

## Pre-launch Checklist

### Performance
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Check Lighthouse score (target: 90+ all categories)
- [ ] Verify images use `next/image` (no raw `<img>`)
- [ ] Check Core Web Vitals in Search Console

### SEO
- [ ] Verify `sitemap.xml` at `/sitemap.xml`
- [ ] Verify `robots.txt` at `/robots.txt`
- [ ] Check Open Graph tags with [opengraph.xyz](https://opengraph.xyz)
- [ ] Submit sitemap to Google Search Console

### Security
- [ ] Verify `/admin` redirects unauthenticated users
- [ ] Test CSP headers with [securityheaders.com](https://securityheaders.com)
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is NOT in `NEXT_PUBLIC_*`
- [ ] Verify RLS blocks unauthenticated writes

### Monitoring
- [ ] Set up uptime monitor at `/api/health` (UptimeRobot free tier)
- [ ] Add error tracking (Sentry free tier)

---

## Local Development

```bash
# Install
npm install

# Set up environment
cp .env.local.example .env.local
# Fill in your Supabase + Google Maps keys

# Run Supabase schema (one-time)
# Paste supabase/schema.sql into Supabase SQL Editor

# Create admin user (one-time)
# Supabase → Authentication → Users → Add user

# Start dev server
npm run dev       # http://localhost:3000
npm run type-check  # TypeScript check
npm test          # Run tests
```

---

## Useful Commands

```bash
npm run dev           # Start development server
npm run build         # Production build
npm run start         # Run production build locally
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run type-check    # TypeScript check (no emit)
npm test              # Jest tests
npm run test:coverage # Tests with coverage report
```
