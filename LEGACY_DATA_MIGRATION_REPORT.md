# Legacy data migration report

## Outcome

The production-configured migration completed successfully on **16 October
2026 at 13:45:50 Arabia Standard Time (UTC+3)**. All records in the supplied
MongoDB BSON export were migrated and then verified against their destination.
No pre-existing destination record was overwritten or deleted.

Migration run ID: `2026-10-16T10-44-12-141Z`

| Destination | Created | Verified |
| --- | ---: | ---: |
| Firestore documents | 98 | 98 |
| D1 article bodies | 77 | 77 |
| R2 PDF objects | 70 | 70 |
| Firebase Authentication users | 1 | 1 |

An independent idempotency pass immediately after the migration found all 98
Firestore documents, 77 D1 bodies, 70 R2 objects, and the Auth user already
migrated with matching source checksums. It planned zero further writes.

A production-build smoke test returned all 3 public products and all 77 public
legacy articles, loaded a 17,407-character migrated article body from D1, and
streamed its migrated R2 file as a valid PDF. The public article request
correctly incremented that article's view counter; the counter was then restored
to its source value of 38 so the final migrated dataset remains exact.

## Source inventory and integrity

| BSON file | Records | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `articles.bson` | 77 | 3,334,360 | `654562c1ba0344b1427c8a5bf2b13be07e57987d6dc14b45a2b7e6585572da43` |
| `categories.bson` | 14 | 1,964 | `12f16b2672efc5232c9d37a288b36a207b2ad4696ee8a83464dd25d4e610fbc6` |
| `orders.bson` | 3 | 2,164 | `9435d7b143ba7954d98eda5506f897a12fa342430aabcf35fc891d0b18f1f27d` |
| `products.bson` | 3 | 3,635 | `0d109b60d98447b1c011afd8af76ee34f5f466132bb980b85b080a2f50b0e50a` |
| `users.bson` | 1 | 207 | `99ae5a36ae3a8c0c8c2869384eee896be2ca261c319994cfb699362a5a9318f9` |

The source contained 98 records in total. Before writing, the migration also
downloaded and validated all 70 study documents (all valid PDFs, 33,183,068
bytes total) and checked all 75 referenced article/product images (all
reachable, 140,401,172 bytes reported by their hosts).

## Exact destination mapping

- The original MongoDB ObjectId is the Firestore document ID. For the legacy
  user it is also the Firebase Auth UID. This preserves author and order-item
  references and makes the import repeatable.
- The one legacy user was imported into Firebase Authentication with its
  existing bcrypt password hash and into Firestore `users`. No plaintext
  password was read, created, logged, or stored by the migration.
- All 14 legacy category reference records were stored in Firestore
  `categories`, including their original names, slugs, ordering, and dates.
- All 3 products were stored in Firestore `products` with their catalog,
  inventory, SEO, image URL, status, and original timestamp fields.
- All 3 historical orders were stored in Firestore `orders`, including customer
  details, addresses, line-item snapshots, totals, payment/fulfilment states,
  notes, shipping methods, order numbers, and timestamps.
- Article metadata for all 77 articles was stored in Firestore `articles`.
  Article content for all 77 was stored under the same ID in D1
  `article_content`.
- The 70 downloadable articles were categorized as `study` for the new site.
  Their original category slug remains in both `studyCategory` and
  `legacyCategory`. The 7 non-downloadable recipe articles were categorized as
  `recipe`.
- All 70 legacy Cloudinary raw documents were copied to private R2 keys beneath
  `study-materials/legacy/<article-id>/...pdf`. Each object has its byte length
  and SHA-256 recorded in R2 metadata and is served through the new protected
  study-material route.
- Existing Cloudinary article and product image URLs were retained because the
  new stack already uses Cloudinary. Every referenced URL was checked before
  the migration and was reachable.
- Original creation/update dates, article publication dates, article view
  counts, slugs, publication states, SEO fields, and relationship IDs were
  preserved.

## Legacy exceptions handled without data loss

- The 3 historical orders had no registered-user relation in the MongoDB
  export. Each received a deterministic, non-login `legacy-guest:` identifier.
  The orders remain available to administrators, and no fake customer login
  accounts were created.
- One older order line refers to a product deleted before the BSON export. Its
  original product ID and full line-item snapshot were preserved and the line
  was marked `legacyProductMissing: true`.
- The destination already contained one administrator/profile and one test
  article with its D1 body. They had different IDs and were left unchanged.

## Destination totals after migration

| Store/collection | Total after migration | Existing before | Added |
| --- | ---: | ---: | ---: |
| Firebase Authentication | 2 users | 1 | 1 |
| Firestore `users` | 2 | 1 | 1 |
| Firestore `categories` | 14 | 0 | 14 |
| Firestore `products` | 3 | 0 | 3 |
| Firestore `orders` | 3 | 0 | 3 |
| Firestore `articles` | 78 | 1 | 77 |
| D1 `article_content` | 78 | 1 | 77 |

## Safety and recovery artifacts

The reusable migration is implemented in `scripts/migrate-legacy-data.mjs`.
It defaults to read-only dry-run mode, refuses mismatched destination records,
stores a checksum and migration provenance on each Firestore document, and
rolls back newly created data when a later stage fails.

Private machine-readable reports and the pre-write destination snapshot are in
`app/migrated-data/reports/`. This path is intentionally ignored by Git because
the backup can contain private data. The source BSON directory is also ignored.

The D1 helper was corrected to match the configured Cloudflare REST endpoint,
which accepts one query object per request. This was discovered during the
read-only preflight, before any destination writes.
