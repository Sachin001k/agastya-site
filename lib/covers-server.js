// Cover images for conversations, stored as site-media/covers/<slug>.<ext>.
import { unstable_cache } from 'next/cache';
import { createAdminClient, getServiceRoleKey } from '@/lib/supabase-admin';

export const MEDIA_BUCKET = 'site-media';
export const COVER_DIR = 'covers';
export const COVERS_TAG = 'conversation-covers';
export const COVER_EXTS = ['jpg', 'png', 'webp'];

// { slug: publicUrl }. The ?v= suffix changes on every upload, so the CDN never serves an old image.
export async function loadConversationCovers() {
  if (!getServiceRoleKey()) return {};
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage.from(MEDIA_BUCKET).list(COVER_DIR, { limit: 1000 });
    if (error || !data) return {};
    const covers = {};
    for (const file of data) {
      const slug = file.name.replace(/\.[^.]+$/, '');
      const { data: url } = admin.storage.from(MEDIA_BUCKET).getPublicUrl(`${COVER_DIR}/${file.name}`);
      covers[slug] = `${url.publicUrl}?v=${encodeURIComponent(file.updated_at || file.created_at || '')}`;
    }
    return covers;
  } catch {
    return {};
  }
}

export const getConversationCovers = unstable_cache(loadConversationCovers, ['conversation-covers'], { tags: [COVERS_TAG], revalidate: 300 });
