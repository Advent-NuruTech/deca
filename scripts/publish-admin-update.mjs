// Publish a completed release note directly to D1. Pass an id, title and plain-text body.
const [id, title, body] = process.argv.slice(2);
if (!id || !/^[A-Za-z0-9_-]{1,128}$/.test(id) || !title?.trim() || title.trim().length > 120 || !body?.trim() || body.length > 5000) {
  console.error('Usage: node --env-file=.env.local scripts/publish-admin-update.mjs <stable-id> <title> <plain-text-body>');
  process.exit(1);
}
const accountId = process.env.CF_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;
const databaseId = process.env.D1_DATABASE_ID;
const token = process.env.CF_API_TOKEN ?? process.env.R2_API_TOKEN;
if (!accountId || !databaseId || !token) { console.error('Cloudflare D1 configuration is missing.'); process.exit(1); }
const escaped = body.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const content = escaped.split(/\n\s*\n/).map((part) => `<p>${part.replace(/\n/g, '<br>')}</p>`).join('');
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`, {
  method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ sql: 'INSERT INTO admin_updates (id, title, content) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING', params: [id, title.trim(), content] }),
});
const result = await response.json();
if (!response.ok || !result.success) { console.error('Could not publish update:', result.errors?.map((error) => error.message).join('; ') || response.status); process.exit(1); }
console.log(Number(result.result?.[0]?.meta?.changes ?? 0) ? 'Update published.' : 'An update with this ID already exists; it was not changed.');
