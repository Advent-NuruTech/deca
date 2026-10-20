<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Resource taxonomy invariants

Before changing resources, categories, article APIs, or document deletion, read
`RESOURCE_TAXONOMY.md`. Major categories and subcategories are administrator-managed
Firestore records referenced by stable IDs. Never restore hardcoded category unions
or use editable names/slugs as foreign keys. Category moves must update references,
not re-upload files, and deletion must not leave article bodies or managed media behind.
