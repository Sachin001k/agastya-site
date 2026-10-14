'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/writings', label: 'Essays', icon: '✍️' },
  { href: '/admin/conversations', label: 'Conversations', icon: '🎙️' },
  { href: '/admin/survey', label: 'Survey responses', icon: '📋' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/content', label: 'Website content', icon: '🖊️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-shell { flex-direction: column; }
          .admin-topbar { display: flex !important; }
          .admin-sidebar { position: fixed !important; top: 0; left: 0; bottom: 0; z-index: 70; transform: translateX(-100%); transition: transform 0.25s ease; }
          .admin-sidebar.open { transform: none; box-shadow: 0 0 40px rgba(0,0,0,0.4); }
          .admin-main > div { padding: 20px 16px !important; }
          .admin-editor-grid { grid-template-columns: 1fr !important; }
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="admin-topbar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#060f0b', borderBottom: '1px solid #1a4a2a', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontSize: '30px', color: '#f59e0b', lineHeight: 1 }}>AK</span>
        <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#477e67' }}>Admin Panel</span>
        <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} style={{ background: 'none', border: '1px solid #1a4a2a', borderRadius: '8px', color: '#fdfcf8', fontSize: '18px', padding: '4px 10px', cursor: 'pointer' }}>☰</button>
      </div>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 65 }} />}

    <aside className={`admin-sidebar${open ? ' open' : ''}`} style={{ width: '240px', minHeight: '100vh', background: '#060f0b', borderRight: '1px solid #1a4a2a', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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
    </>
  );
}
