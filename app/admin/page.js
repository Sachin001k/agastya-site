import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    { count: writingsCount },
    { count: convsCount },
    { count: energyCount },
    { count: feedbackCount },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from('writings').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('energy_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('feedback_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('feedback_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  const stats = [
    { label: 'Essays',             value: writingsCount ?? 0, href: '/admin/writings',     color: '#356452' },
    { label: 'Conversations',      value: convsCount    ?? 0, href: '/admin/conversations', color: '#b45309' },
    { label: 'Survey responses',   value: energyCount   ?? 0, href: '/admin/submissions',  color: '#477e67' },
    { label: 'Messages',           value: feedbackCount ?? 0, href: '/admin/submissions',  color: '#0d2318',
      badge: unreadCount > 0 ? `${unreadCount} unread` : null },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px' }}>Welcome back. Here&apos;s an overview of the site.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', textDecoration: 'none', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: s.color, margin: '0 0 6px' }}>{s.value}</p>
            <p style={{ fontSize: '13px', color: '#5a6661', margin: 0 }}>{s.label}</p>
            {s.badge && (
              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '11px', fontWeight: '600', color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '999px', border: '1px solid #fecaca' }}>
                {s.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '16px' }}>Quick actions</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { href: '/admin/writings/new',      label: '+ New essay',        color: '#f59e0b', textColor: '#060f0b' },
            { href: '/admin/conversations/new', label: '+ New conversation', color: '#0d2318', textColor: '#fdfcf8' },
            { href: '/admin/submissions',       label: 'View submissions',   color: '#fff',    textColor: '#0d2318', border: '1px solid #e5ddd0' },
            { href: '/admin/settings',          label: 'Edit site settings', color: '#fff',    textColor: '#0d2318', border: '1px solid #e5ddd0' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              style={{ padding: '10px 20px', borderRadius: '999px', background: a.color, color: a.textColor, fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: a.border || 'none' }}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 24px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>How to use the admin panel</p>
        <ul style={{ fontSize: '13px', color: '#5a6661', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
          <li><strong>Essays</strong> — Add, edit, and publish essays. Toggle draft/published status.</li>
          <li><strong>Conversations</strong> — Add interviews and vlogs with YouTube/Vimeo links or direct uploads.</li>
          <li><strong>Submissions</strong> — View energy survey responses and contact messages.</li>
          <li><strong>Settings</strong> — Edit homepage hero text, about bio, contact info, and social links.</li>
        </ul>
      </div>
    </div>
  );
}
