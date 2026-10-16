import "server-only";

import { d1First, d1Run } from "@/lib/d1";

interface ArticleContentRow { content: string }

/** D1 is reserved solely for the long-form body of an article. */
export async function getArticleContent(articleId: string): Promise<string | null> {
  const row = await d1First<ArticleContentRow>(
    "SELECT content FROM article_content WHERE article_id = ? LIMIT 1", [articleId],
  );
  return row?.content ?? null;
}

export async function saveArticleContent(articleId: string, content: string): Promise<void> {
  await d1Run(
    `INSERT INTO article_content (article_id, content, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(article_id) DO UPDATE SET content = excluded.content, updated_at = datetime('now')`,
    [articleId, content],
  );
}

export async function deleteArticleContent(articleId: string): Promise<void> {
  await d1Run("DELETE FROM article_content WHERE article_id = ?", [articleId]);
}
