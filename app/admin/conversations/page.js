import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const metadata = { title: 'Conversations' };

export default async function AdminConversationsPage() {
  const supabase = createClient();
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, slug, type, is_published, guest_name, duration_seconds')
    .order('created_at', { ascending: false });

  const formatDuration = (secs) => {
    if (!secs) return null;
    const mins = Math.round(secs / 60);
    return mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>Conversations</h1>
          <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px' }}>{conversations?.length ?? 0} videos total</p>
        </div>
        <Link href="/admin/conversations/new" style={{ padding: '10px 20px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
          + Add video
        </Link>
      </div>

      {conversations && conversations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {conversations.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: c.is_published ? '#f0f7f4' : '#fef9ec', color: c.is_published ? '#356452' : '#b45309', border: `1px solid ${c.is_published ? '#bbd7c8' : '#fde68a'}` }}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', background: c.type === 'interview' ? '#f0f7f4' : '#fef9ec', color: c.type === 'interview' ? '#356452' : '#b45309' }}>
                    {c.type}
                  </span>
                  {formatDuration(c.duration_seconds) && (
                    <span style={{ fontSize: '11px', color: '#8a948f' }}>{formatDuration(c.duration_seconds)}</span>
                  )}
                </div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#0d2318', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.title}
                </p>
                {c.guest_name && <p style={{ fontSize: '12px', color: '#8a948f', margin: '4px 0 0' }}>with {c.guest_name}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {c.is_published && (
                  <Link href={`/conversations/${c.slug}`} target="_blank" style={{ padding: '8px 14px', borderRadius: '8px', background: '#f5f0e8', color: '#5a6661', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                    View ↗
                  </Link>
                )}
                <Link href={`/admin/conversations/${c.id}`} style={{ padding: '8px 14px', borderRadius: '8px', background: '#0d2318', color: '#fdfcf8', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c8b89a', marginBottom: '8px' }}>No conversations yet</p>
          <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '24px' }}>Add your first interview or vlog.</p>
          <Link href="/admin/conversations/new" style={{ padding: '10px 24px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
            + Add video
          </Link>
        </div>
      )}
    </div>
  );
}
