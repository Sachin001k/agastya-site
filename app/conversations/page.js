import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';

export default function ConversationsPage() {
  const placeholderConversations = [
    { slug: 'conversation-1', type: 'Interview', title: 'Conversation title will appear here', guest: 'Guest name · Organisation', duration: '24 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
    { slug: 'conversation-2', type: 'Vlog',      title: 'Conversation title will appear here', guest: 'Agastya Khanna',            duration: '12 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
    { slug: 'conversation-3', type: 'Interview', title: 'Conversation title will appear here', guest: 'Guest name · Organisation', duration: '31 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
    { slug: 'conversation-4', type: 'Vlog',      title: 'Conversation title will appear here', guest: 'Agastya Khanna',            duration: '18 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
    { slug: 'conversation-5', type: 'Interview', title: 'Conversation title will appear here', guest: 'Guest name · Organisation', duration: '27 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
    { slug: 'conversation-6', type: 'Vlog',      title: 'Conversation title will appear here', guest: 'Agastya Khanna',            duration: '15 min', desc: 'A short description of this conversation will appear here once the scholar publishes it through the admin panel.' },
  ];

  return (
    <>
      <ScrollReveal />

      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '72px 32px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>CONVERSATIONS</span>
          </div>

          <div className='two-col-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-1px' }}>
                Interviews &amp; <span style={{ color: '#f59e0b' }}>vlogs</span>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', maxWidth: '420px' }}>
                Conversations with researchers, policymakers, and households on India&apos;s energy transition — plus personal video logs from the field.
              </p>
            </div>
            <div className='conv-stats' style={{ display: 'flex', gap: '24px', justifyContent: 'flex-end' }}>
              {[
                { label: 'Interviews', value: '—' },
                { label: 'Vlogs',      value: '—' },
                { label: 'Total mins', value: '—' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '36px' }}>
            {['All', 'Interviews', 'Vlogs'].map((type, i) => (
              <span
                key={type}
                style={{
                  padding: '7px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                  color: i === 0 ? '#060f0b' : 'rgba(255,255,255,0.7)',
                  border: '1px solid',
                  borderColor: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {placeholderConversations.map((c, i) => (
              <Link
                key={c.slug}
                href={`/conversations/${c.slug}`}
                className={`reveal reveal-${Math.min(i + 1, 4)} hover-card`}
                style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                {/* Thumbnail */}
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a 0%, #060f0b 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Play button */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245,158,11,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}>
                    <span style={{ fontSize: '20px', marginLeft: '4px' }}>▶</span>
                  </div>
                  {/* Duration badge */}
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '3px 8px' }}>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: '500' }}>{c.duration}</span>
                  </div>
                  {/* Type badge */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: c.type === 'Interview' ? 'rgba(53,100,82,0.9)' : 'rgba(180,83,9,0.9)', borderRadius: '4px', padding: '3px 10px' }}>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.type}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '12px', color: '#8a948f', marginBottom: '8px' }}>{c.guest}</p>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#c8b89a', lineHeight: 1.4, marginBottom: '10px', flex: 1 }}>
                    {c.title}
                  </h2>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#b0a898', marginBottom: '16px' }}>
                    {c.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f0ebe0' }}>
                    <span style={{ fontSize: '12px', color: '#8a948f' }}>Coming soon</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#b45309' }}>Watch →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#060f0b', padding: '80px 20px' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Want to be part of a conversation?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            Agastya is always looking to speak with researchers, policymakers, and households about India&apos;s energy transition.
          </p>
          <Link
            href="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}
          >
            Get in touch →
          </Link>
        </div>
      </section>
    </>
  );
}