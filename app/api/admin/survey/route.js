import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase-admin';

// Delete survey responses: { ids: [...] }
export async function DELETE(request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { ids } = await request.json().catch(() => ({}));
  if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'No responses selected' }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from('energy_submissions').delete().in('id', ids).select('id');
    if (error) throw error;
    revalidatePath('/', 'layout');
    return NextResponse.json({ deleted: data.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
