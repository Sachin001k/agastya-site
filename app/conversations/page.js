import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import ConversationsGrid from './ConversationsGrid';

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
          </div>

        </div>
      </section>

      {/* ── GRID ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ConversationsGrid conversations={placeholderConversations} />
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