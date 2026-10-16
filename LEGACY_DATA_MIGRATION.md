# Legacy data migration

The source is the MongoDB BSON export in `app/migrated-data/test`. That folder
contains personal customer data and remains excluded from Git.

## Safety model

- The migration is a dry run unless `--apply` is explicitly supplied.
- Original MongoDB ObjectIds become destination IDs, preserving author and
  product references and making reruns deterministic.
- Existing destination records are never overwritten. A mismatched record,
  Firebase Auth identity, D1 article body, or R2 object stops the run.
- Every legacy PDF and referenced image is checked before any write occurs.
- Newly created records are rolled back if a later migration stage fails.
- Private JSON run reports and pre-write snapshots are written beneath
  `app/migrated-data/reports`, which is ignored by Git.
- Passwords remain bcrypt hashes. The migration never obtains or logs a
  plaintext password.

## Run

First review the read-only plan:

```powershell
npm run migrate:legacy
```

Apply only after the dry run succeeds:

```powershell
npm run migrate:legacy:apply
```

Running the apply command again is safe: records previously imported from the
same source checksum are verified and skipped.

## Destination mapping

| Legacy collection/data | New destination |
| --- | --- |
| User identities and bcrypt passwords | Firebase Authentication |
| User profiles | Firestore `users` |
| Products | Firestore `products` |
| Orders | Firestore `orders` |
| Category reference data | Firestore `categories` |
| Article metadata | Firestore `articles` |
| Article body HTML/text | Cloudflare D1 `article_content` |
| Downloadable study PDFs | Cloudflare R2 `study-materials/legacy/...` |
| Existing article/product images | Retained Cloudinary URLs, checked before migration |

Downloadable legacy articles are mapped to the new `study` category and keep
their original category slug in both `studyCategory` and `legacyCategory`.
Historical guest orders did not have a user relation in MongoDB. They receive
a deterministic, non-login `legacy-guest:` identifier and remain visible to
administrators without inventing customer accounts. Historical order lines
whose products had already been deleted retain their original product ID and
item snapshot and are marked `legacyProductMissing`.
