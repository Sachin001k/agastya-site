'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/writings', label: 'Essays' },
  { href: '/conversations', label: 'Conversations' },
  { href: '/research', label: 'Research' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const transparent = isHome && !scrolled;

  return (
    <>
      {!isHome && <div style={{ height: '72px' }} />}

      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        background: transparent ? 'transparent' : '#fdfcf8',
        borderBottom: transparent ? 'none' : '1px solid #e5ddd0',
        boxShadow: transparent ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          {/* <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image
              src="/images/FullLogo_Transparent_NoBuffer.png"
              alt="Agastya Khanna"
              width={56}
              height={56}
              style={{ height: '56px', width: 'auto' }}
              priority
            />
          </Link> */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              fontSize: '34px',
              color: '#f59e0b',
              fontWeight: '400',
              lineHeight: 1
            }}>
              AK
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: active ? '700' : '500',
                    textDecoration: 'none',
                    background: active ? '#f59e0b' : 'transparent',
                    color: active ? '#060f0b' : transparent ? 'rgba(255,255,255,0.85)' : '#2a5043',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/energy-survey"
              style={{ marginLeft: '8px', padding: '9px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', background: '#f59e0b', color: '#060f0b', whiteSpace: 'nowrap' }}
            >
              Check Your Energy Use
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(v => !v)}
            className="mobile-menu-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            <span style={{ display: 'block', width: '24px', height: '2px', background: transparent ? '#fff' : '#0d2318', borderRadius: '2px', transition: 'all 0.3s ease', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '24px', height: '2px', background: transparent ? '#fff' : '#0d2318', borderRadius: '2px', transition: 'all 0.3s ease', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: '24px', height: '2px', background: transparent ? '#fff' : '#0d2318', borderRadius: '2px', transition: 'all 0.3s ease', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '72px', left: 0, right: 0, bottom: 0,
          zIndex: 49,
          background: '#fdfcf8',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
        }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: active ? '700' : '500',
                  textDecoration: 'none',
                  background: active ? '#f59e0b' : '#f5f0e8',
                  color: active ? '#060f0b' : '#0d2318',
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/energy-survey"
            style={{ marginTop: '8px', padding: '16px 18px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', background: '#f59e0b', color: '#060f0b', textAlign: 'center' }}
          >
            Check Your Energy Use
          </Link>
        </div>
      )}

    </>
  );
}