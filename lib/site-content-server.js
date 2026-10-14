// Server-only reads of the editable website content.
// Supabase's storage CDN keeps serving old copies after a save, so every read
// is cache-busted; Next's own cache (cleared on save) keeps pages fast.
import { unstable_cache } from 'next/cache';
import { getServiceRoleKey } from '@/lib/supabase-admin';
import { CONTENT_BUCKET, CONTENT_FILE, CONTENT_TAG, DEFAULT_CONTENT, contentUrl, mergeContent } from '@/lib/site-content';

async function readStored() {
  // A unique query string on every read: Supabase's CDN fronts even the
  // authenticated endpoint and can serve a stale copy right after a save.
  const bust = `v=${Date.now()}`;
  const key = getServiceRoleKey();
  const res = key
    ? await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/${CONTENT_BUCKET}/${CONTENT_FILE}?${bust}`, {
        headers: { Authorization: `Bearer ${key}`, apikey: key },
        cache: 'no-store',
      })
    : await fetch(`${contentUrl()}?${bust}`, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}

async function loadContent() {
  try {
    return mergeContent(DEFAULT_CONTENT, await readStored());
  } catch {
    return DEFAULT_CONTENT;
  }
}

// For public pages. Cached; saving in the admin panel clears it via revalidateTag.
export const getSiteContent = unstable_cache(loadContent, ['site-content'], { tags: [CONTENT_TAG], revalidate: 300 });

// For the admin editor: always the latest saved version.
export const getSiteContentFresh = loadContent;
