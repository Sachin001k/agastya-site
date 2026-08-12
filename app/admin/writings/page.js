import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const metadata = { title: 'Essays' };

export default async function AdminWritingsPage() {
  const supabase = createClient();
  const { data: writings } = await supabase
    .from('writings')
    .select('id, title, slug, is_published, published_at, reading_time, tags')
    .order('created_at', { ascending: false });

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>Essays</h1>
          <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px' }}>{writings?.length ?? 0} essays total</p>
        </div>
        <Link
          href="/admin/writings/new"
          style={{ padding: '10px 20px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}
        >
          + New essay
        </Link>
      </div>

      {writings && writings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {writings.map((w) => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: w.is_published ? '#f0f7f4' : '#fef9ec', color: w.is_published ? '#356452' : '#b45309', border: `1px solid ${w.is_published ? '#bbd7c8' : '#fde68a'}` }}>
                    {w.is_published ? 'Published' : 'Draft'}
                  </span>
                  {w.tags?.slice(0, 2).map(tag => (
                    <span key={tag} style={{ fontSize: '11px', color: '#8a948f', background: '#f5f0e8', padding: '2px 8px', borderRadius: '999px' }}>{tag}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#0d2318', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {w.title}
                </p>
                <p style={{ fontSize: '12px', color: '#8a948f', margin: '4px 0 0' }}>
                  {w.reading_time} min read · /{w.slug}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {w.is_published && (
                  <Link href={`/writings/${w.slug}`} target="_blank" style={{ padding: '8px 14px', borderRadius: '8px', background: '#f5f0e8', color: '#5a6661', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                    View ↗
                  </Link>
                )}
                <Link href={`/admin/writings/${w.id}`} style={{ padding: '8px 14px', borderRadius: '8px', background: '#0d2318', color: '#fdfcf8', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c8b89a', marginBottom: '8px' }}>No essays yet</p>
          <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '24px' }}>Create your first essay to get started.</p>
          <Link href="/admin/writings/new" style={{ padding: '10px 24px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
            + New essay
          </Link>
        </div>
      )}
    </div>
  );
}
