// Server-only Supabase client with the service-role key. Never import this from a
// 'use client' file — the key bypasses row-level security.
import { createClient } from '@supabase/supabase-js';

export function getServiceRoleKey() {
  // NEXT_PUBLIC_SERVICE_ROLE is the old name; kept as a fallback until every environment is updated.
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SERVICE_ROLE || null;
}

export function createAdminClient() {
  const key = getServiceRoleKey();
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set on the server.');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Creates a storage bucket on first use.
export async function ensureBucket(admin, name, options = { public: true }) {
  const { data } = await admin.storage.getBucket(name);
  if (!data) {
    const { error } = await admin.storage.createBucket(name, options);
    if (error && !/already exists/i.test(error.message)) throw error;
  }
}
