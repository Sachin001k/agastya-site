// Comma-separated ADMIN_EMAILS decides who can use the admin panel.
// If it's unset, any signed-in user counts as an admin — so set it in every environment.
export function isAdminEmail(email) {
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true;
  return !!email && allowed.includes(email.toLowerCase());
}
