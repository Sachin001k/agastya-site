import Link from 'next/link';

export default function ConversationDetailPage({ params }) {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '72px 32px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link
            href="/conversations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7aaa8e', textDecoration: 'none', marginBottom: '32px' }}
          >
            ← Back to conversations
          </Link>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', background: 'rgba(53,100,82,0.8)', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Interview
            </span>
            <span style={{ fontSize: '11px', color: '#7aaa8e' }}>24 min watch</span>
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', lineHeight: 1.15, color: '#fdfcf8', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            Conversation title will appear here once published
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.6)', marginBottom: '28px', maxWidth: '600px' }}>
            A short description of this conversation will appear here. The scholar adds this through the admin panel when publishing.
          </p>

          {/* Guest info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px' }}>👤</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#fdfcf8', margin: 0 }}>Guest name will appear here</p>
              <p style={{ fontSize: '12px', color: '#7aaa8e', margin: 0 }}>Organisation · Role</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIDEO PLAYER ── */}
      <section style={{ background: '#0d2318', padding: '48px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a, #060f0b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #1a4a2a' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', marginLeft: '4px' }}>▶</span>
            </div>
            <p style={{ fontSize: '14px', color: '#7aaa8e', marginBottom: '4px' }}>Video coming soon</p>
            <p style={{ fontSize: '12px', color: '#477e67' }}>The scholar will add the video through the admin panel.</p>
          </div>
        </div>
      </section>

      {/* ── DESCRIPTION + TRANSCRIPT ── */}
      <section style={{ background: '#fdfcf8', padding: '64px 32px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '16px' }}>
            About this conversation
          </h2>

          {/* Placeholder lines */}
          {[1, 2, 3].map((_, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '100%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', marginBottom: '10px', width: '90%' }} />
              <div style={{ height: '14px', background: '#e5ddd0', borderRadius: '3px', width: '75%' }} />
            </div>
          ))}

          {/* Key takeaways */}
          <div style={{ marginTop: '40px', padding: '24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#356452', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>Key takeaways</p>
            {[1, 2, 3].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '6px', flexShrink: 0 }} />
                <div style={{ height: '13px', background: '#e5ddd0', borderRadius: '3px', flex: 1 }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', padding: '20px 24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '4px' }}>Transcript coming soon</p>
            <p style={{ fontSize: '13px', color: '#b0a898' }}>A full transcript will be available once the video is published.</p>
          </div>
        </div>
      </section>

      {/* ── MORE CONVERSATIONS ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 32px 80px', borderTop: '1px solid #e5ddd0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
            More conversations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { type: 'Interview', duration: '24 min' },
              { type: 'Vlog',      duration: '12 min' },
              { type: 'Interview', duration: '31 min' },
            ].map((c, i) => (
              <div
                key={i}
                className="hover-card"
                style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a, #060f0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '24px', opacity: 0.4 }}>▶</span>
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 7px' }}>
                    <span style={{ fontSize: '11px', color: '#fff' }}>{c.duration}</span>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#b45309', marginBottom: '6px' }}>{c.type}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '600', color: '#c8b89a' }}>Conversation title will appear here</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link
              href="/conversations"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '999px', background: '#0d2318', color: '#fdfcf8', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}
            >
              View all conversations →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}