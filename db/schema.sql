-- Cloudflare D1 is intentionally limited to article body text.
-- Article metadata, users, products, orders, contacts and donations live in
-- Firestore. Images live in Cloudinary. Downloadable documents live in R2.
-- Apply with: node --env-file=.env.local scripts/d1-migrate.mjs

CREATE TABLE IF NOT EXISTS article_content (
  article_id  TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
