import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient, ensureBucket } from '@/lib/supabase-admin';
import { CONTENT_BUCKET, CONTENT_FILE, CONTENT_TAG, DEFAULT_CONTENT, mergeContent } from '@/lib/site-content';

// Save the website content JSON.
export async function PUT(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const content = mergeContent(DEFAULT_CONTENT, body?.content);

  try {
    const admin = createAdminClient();
    await ensureBucket(admin, CONTENT_BUCKET);
    const { error } = await admin.storage
      .from(CONTENT_BUCKET)
      .upload(CONTENT_FILE, JSON.stringify(content, null, 2), { upsert: true, contentType: 'application/json', cacheControl: '0' });
    if (error) throw error;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
  return NextResponse.json({ content });
}
