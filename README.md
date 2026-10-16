# Remsam Kenya

Remsam Kenya is a full-stack Next.js App Router application. The public site,
admin dashboard, same-origin APIs, and service integrations all run from this
repository root.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```powershell
Copy-Item .env.example .env.local
npm ci
npm run phase8:check
npm run dev
```

Open `http://localhost:3000`. See `ENVIRONMENT.md` for variable and administrator
setup details. Never commit `.env.local` or service-account JSON files.

## Verification

```powershell
npm run typecheck
npm run build
```

Use `npm run verify` to run both checks. Service-specific smoke tests are
documented in `DEPLOYMENT.md`.

## Vercel

Import the Git repository as a Next.js project and leave **Root Directory**
empty (the application is at the repository root). Add all variables from
`.env.example` in Vercel, then deploy using the default `npm run build` command.

Follow `DEPLOYMENT.md` for the complete pre-deployment and production checklist.
