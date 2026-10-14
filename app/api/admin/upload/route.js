import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient, ensureBucket } from '@/lib/supabase-admin';
import { MEDIA_BUCKET, COVER_DIR, COVERS_TAG, COVER_EXTS } from '@/lib/covers-server';

const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 5 * 1024 * 1024;

const slugOf = v => String(v || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);

// Upload an image and return its public URL.
// With a `cover` field (a conversation slug) it becomes that conversation's cover image.
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const form = await request.formData();
  const file = form.get('file');
  const name = String(form.get('name') || 'image').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'image';
  const cover = slugOf(form.get('cover'));
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: 'Use a JPG, PNG or WebP image' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 });

  try {
    const admin = createAdminClient();
    await ensureBucket(admin, MEDIA_BUCKET);

    if (cover) {
      // One cover per conversation: clear any other format first
      await admin.storage.from(MEDIA_BUCKET).remove(COVER_EXTS.map(e => `${COVER_DIR}/${cover}.${e}`));
      const path = `${COVER_DIR}/${cover}.${ext}`;
      const { error } = await admin.storage
        .from(MEDIA_BUCKET)
        .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: '31536000', upsert: true });
      if (error) throw error;
      revalidateTag(COVERS_TAG);
      revalidatePath('/', 'layout');
      const { data } = admin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      return NextResponse.json({ url: `${data.publicUrl}?v=${Date.now()}` });
    }

    // Timestamped name so browsers and the CDN never show a stale image
    const path = `${name}-${Date.now()}.${ext}`;
    const { error } = await admin.storage
      .from(MEDIA_BUCKET)
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: '31536000' });
    if (error) throw error;
    const { data } = admin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Remove a conversation cover: { cover: slug }
export async function DELETE(request) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { cover } = await request.json().catch(() => ({}));
  const slug = slugOf(cover);
  if (!slug) return NextResponse.json({ error: 'No cover specified' }, { status: 400 });
  try {
    const admin = createAdminClient();
    await admin.storage.from(MEDIA_BUCKET).remove(COVER_EXTS.map(e => `${COVER_DIR}/${slug}.${e}`));
    revalidateTag(COVERS_TAG);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
