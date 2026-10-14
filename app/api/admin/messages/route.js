import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase-admin';

// Mark messages read/unread: { ids: [...], is_read: boolean }
export async function PATCH(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { ids, is_read } = await request.json().catch(() => ({}));
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'No messages selected' }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { error } = await admin.from('feedback_submissions').update({ is_read: !!is_read }).in('id', ids);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Delete messages: { ids: [...] }
export async function DELETE(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { ids } = await request.json().catch(() => ({}));
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'No messages selected' }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('feedback_submissions').delete().in('id', ids).select('id');
    if (error) throw error;
    return NextResponse.json({ deleted: data.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
