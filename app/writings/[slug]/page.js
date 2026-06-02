import Link from 'next/link';

export default function WritingDetailPage({ params }) {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '72px 32px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link
            href="/writings"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7aaa8e', textDecoration: 'none', marginBottom: '32px' }}
          >
            ← Back to writings
          </Link>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#356452', background: 'rgba(53,100,82,0.15)', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Energy Policy
            </span>
            <span style={{ fontSize: '11px', color: '#7aaa8e' }}>6 min read</span>
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '700', lineHeight: 1.15, color: '#fdfcf8', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            Essay title will appear here once published
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(253,252,248,0.6)', marginBottom: '32px' }}>
            A short description or excerpt of the essay will appear here. The scholar adds this through the admin panel when publishing.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>AK</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#fdfcf8', margin: 0 }}>Agastya Khanna</p>
              <p style={{ fontSize: '12px', color: '#7aaa8e', margin: 0 }}>Coming soon · 6 min read</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ background: '#fdfcf8', padding: '64px 32px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Placeholder content blocks */}
          {[1, 2, 3].map((_, i) => (
            <div key={i} style={{ marginBottom: '32px' }}>
              {i === 0 && (
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#c8b89a', marginBottom: '16px' }}>
                  Section heading will appear here
                </h2>
              )}
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '100%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '92%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '97%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '85%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', width: '78%' }} />
            </div>
          ))}

          <div style={{ padding: '24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0', marginTop: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '4px' }}>Full essay content coming soon</p>
            <p style={{ fontSize: '13px', color: '#b0a898' }}>The scholar will publish essays through the admin panel.</p>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 32px 80px', borderTop: '1px solid #e5ddd0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
            More writings
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="hover-card"
                style={{ padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ width: '100%', height: '3px', background: '#e5ddd0', borderRadius: '2px', marginBottom: '16px' }}>
                  <div style={{ width: `${55 + i * 15}%`, height: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', borderRadius: '2px' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coming soon</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#c8b89a' }}>Essay title will appear here</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link
              href="/writings"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '999px', background: '#0d2318', color: '#fdfcf8', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}
            >
              View all writings →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}