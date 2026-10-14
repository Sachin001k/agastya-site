import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { isAdminEmail } from '@/lib/admin-emails';

export { isAdminEmail };

// Returns the signed-in admin user, or null.
export async function getAdminUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// For API routes: returns a 401 response when the caller isn't an admin.
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) return { user: null, response: NextResponse.json({ error: 'Not authorised' }, { status: 401 }) };
  return { user, response: null };
}
