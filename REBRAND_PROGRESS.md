# Gilead Medicare rebrand progress

## Current phase — complete

- Replaced the public brand foundation with `Gilead Medicare Food and Nutrition Services` and the approved Gilead Medicare visual system.
- Rebuilt the public header, footer, home page, About page and Contact page around the new mission.
- Added the public `/programmes` directory covering all ten requested service areas.
- Added `/invite-gilead` as a clear, non-persistent request landing page with an email fallback.
- Centralised the public organisation name and contact email in `lib/site-config.ts`.
- No Firestore, D1 or other database writes were made.

## Next phase

Build the complete **Invite GILEAD for a Programme** form from the supplied six sections. It must have client-side validation, accessible grouped controls, the required health-education acknowledgement, a clear success state, and must not persist or submit data to a database. Use an email handoff or an explicitly configured external delivery method only after approval.

## Later phases

1. Add printable, non-persistent Home-Based Care Registration and Patient Registration consent documents, after legal/clinical review of the wording and operating jurisdiction.
2. Add the printable Employment Contract and Employee Declaration document.
3. Audit remaining legacy public routes (shop, articles, authentication and legal pages) and replace old RemSam content without altering existing product/resource data.
