# Git and Vercel deployment

## 1. Verify locally

Keep real credentials only in `.env.local` and run:

```powershell
npm ci
npm run phase8:check
npm run verify
```

When service changes need live verification, also run the relevant commands:

```powershell
npm run migrate:d1
npm run smoke:firebase
npm run smoke:cloudinary
npm run smoke:r2
```

The service smoke tests may create and immediately remove temporary records or
objects. The production HTTP smoke suite is read-only.

## 2. Commit and push

Before committing, confirm `.env.local`, `.next`, `node_modules`, and any
service-account JSON file are absent from `git status`:

```powershell
git add -A
git status
git diff --cached --check
git commit -m "Migrate application to root Next.js stack"
git push origin HEAD
```

If `.env.local` appears in the staged changes, stop and remove it from the
index with `git restore --staged .env.local` before committing.

## 3. Configure Vercel

1. Import the Git repository into Vercel.
2. Select **Next.js** as the framework preset.
3. Leave **Root Directory** empty because `package.json` is at repository root.
4. Keep the install command as `npm install` and build command as
   `npm run build`.
5. Copy the variables named in `.env.example` into the appropriate Vercel
   Development, Preview, and Production environments. Do not upload
   `.env.local` itself.
6. Deploy a Preview and complete the application acceptance checks before
   promoting it to Production.

## 4. Acceptance and production smoke test

- Verify administrator and normal-user authorization.
- Create, update, and delete a disposable product and article, including media.
- Complete checkout with a test product and verify stock and order ownership.
- Submit the contact and donation forms and verify their Firestore records.
- Check public and admin routes at desktop and mobile widths.
- Confirm the custom domain, HTTPS, redirects, and canonical routes.

Then run the read-only HTTP smoke suite:

```powershell
npm run phase8:smoke -- https://your-production-domain.example
```

Monitor Vercel, Firebase, Cloudinary, and Cloudflare logs during acceptance.
