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

## Production UI and UX standard

All interface work must be production-ready, not prototype-grade. Use coherent visual
hierarchy, responsive layouts, accessible semantics and keyboard states, clear loading,
empty, error, and success feedback, and polished interaction details. Preserve established
design tokens and patterns, and verify user flows on both mobile and desktop before handoff.

## Search indexing and administrative security

No route under `/admin` may be indexed. Preserve all three enforcement layers:
the admin layout's `robots` metadata, the `/admin/` exclusion in `robots.ts`, and
the `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` response header. New
admin routes must remain beneath the shared `/admin` layout and must never override
these directives with indexable metadata.
