import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient, ensureBucket } from '@/lib/supabase-admin';

const MEDIA_BUCKET = 'site-media';
const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 5 * 1024 * 1024;

// Upload an image (e.g. the About photo) and return its public URL.
export async function POST(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const form = await request.formData();
  const file = form.get('file');
  const name = String(form.get('name') || 'image').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'image';
  if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: 'Use a JPG, PNG or WebP image' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 });

  try {
    const admin = createAdminClient();
    await ensureBucket(admin, MEDIA_BUCKET);
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
