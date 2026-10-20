# Resource taxonomy contract

## Product brief

The Resources navigation is a configurable hierarchy. Its initial major categories
are **Articles & Blogs** and **Study Library**. Administrators can rename either one,
create additional major categories, and create, rename, move, or delete any number of
subcategories. These labels are content, not code constants.

Every resource is assigned to one major category and may be assigned to one of that
major category's subcategories. Administrators can move a resource or a whole
subcategory without uploading its image or document again. A category that is still
in use can only be deleted when another category is selected as its destination; the
operation reassigns dependencies first so resources never become orphaned.

Deleting a resource removes all of its owned data: Firestore metadata, the D1 article
body, its managed R2 document, and its managed Cloudinary featured image. A failed
managed-file deletion stops the database deletion so a successful database delete
cannot knowingly leave stored files behind.

## Persistent model

`resourceCategories` is the Firestore collection for both hierarchy levels:

- major: `kind`, `name`, `slug`, `order`
- subcategory: `kind`, `parentId`, `name`, `slug`, `order`
- `_config`: initialization/migration marker; it is not a category

Article metadata stores `majorCategoryId` and optional `subcategoryId`. Document IDs
are the foreign keys. Names and slugs are editable presentation/routing values and
must never be used as foreign keys.

The old `category` and `studyCategory` fields remain read-only compatibility data for
legacy URLs and records. New code must use the stable ID fields.

## Legacy adoption

The first authenticated admin taxonomy load performs an idempotent initialization:

1. Create the initial Articles & Blogs and Study Library records.
2. Adopt `faith`, `recipe`, `agriculture`, and `homeschooling` as subcategories.
3. Adopt old `categories` records and every distinct legacy `studyCategory`.
4. Write stable category IDs onto every existing article.
5. Write `_config` only after scheduling the category and article updates.

Public reads can synthesize this view before initialization, so existing resources
remain visible. Once `_config` exists, deleted defaults are never recreated.

## API rules

- `GET /api/resource-categories` is public; `?scope=admin` includes drafts and ensures
  legacy initialization.
- Category create/update/delete endpoints require an administrator.
- Moving a subcategory updates the major-category reference on all assigned resources.
- Deleting an in-use category requires `replacementId`; resources and/or child
  subcategories move before the source category is removed.
- Article create/update validates that the selected subcategory belongs to the chosen
  major category.
- Article listing accepts stable `majorCategoryId` and `subcategoryId`; the old
  `category` query remains only for backward-compatible links.

## Future-change checklist

- Preserve stable category document IDs through renames.
- Never add a TypeScript union or server whitelist of category names.
- Never encode category ownership in R2 keys or Cloudinary paths.
- Reassignment changes metadata only; it never copies or uploads media.
- Keep legacy fallback until all deployed data has `majorCategoryId` and the old URLs
  have been retired deliberately.
- Test empty and in-use category deletion, cross-major subcategory moves, legacy
  records, downloadable and non-downloadable resources, and partial cleanup failures.
