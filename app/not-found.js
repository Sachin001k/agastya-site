import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#060f0b', padding: '32px', textAlign: 'center' }}>
      <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '12px' }}>
        404 — Page not found
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
        We couldn&apos;t find that page.
      </h1>
      <p style={{ fontSize: '16px', color: '#7aaa8e', marginBottom: '32px', maxWidth: '400px' }}>
        The link may be broken or the page may have moved.
      </p>
      <Link
        href="/"
        style={{ padding: '14px 28px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}
      >
        Back to home
      </Link>
    </div>
  );
}
