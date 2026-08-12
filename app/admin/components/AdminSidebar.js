'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/writings', label: 'Writings', icon: '✍️' },
  { href: '/admin/conversations', label: 'Conversations', icon: '🎙️' },
  { href: '/admin/submissions', label: 'Submissions', icon: '📥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  return (
    <aside style={{ width: '240px', minHeight: '100vh', background: '#060f0b', borderRight: '1px solid #1a4a2a', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1a4a2a' }}>
        {/* <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image
            src="/images/FullLogo_Transparent_NoBuffer.png"
            alt="Agastya Khanna"
            width={36}
            height={36}
            style={{ height: '36px', width: 'auto' }}
          />
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#fdfcf8', margin: 0 }}>Agastya Khanna</p>
            <p style={{ fontSize: '11px', color: '#477e67', margin: 0 }}>Admin Panel</p>
          </div>
        </Link> */}


        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
            fontSize: '56px',
            color: '#f59e0b',
            fontWeight: '400',
            lineHeight: 1,
            display: 'block',
            marginBottom: '16px'
          }}>
            AK
          </span>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#477e67' }}>Admin Panel</p>
        </div>

      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                border: active ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ fontSize: '13px', fontWeight: active ? '600' : '400', color: active ? '#f59e0b' : '#7aaa8e' }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* View site + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #1a4a2a' }}>
        <Link
          href="/"
          target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', textDecoration: 'none' }}
        >
          <span style={{ fontSize: '16px' }}>🌐</span>
          <span style={{ fontSize: '13px', color: '#7aaa8e' }}>View site</span>
        </Link>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '16px' }}>🚪</span>
          <span style={{ fontSize: '13px', color: '#7aaa8e' }}>Log out</span>
        </button>
      </div>
    </aside>
  );
}
