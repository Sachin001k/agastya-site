import Link from 'next/link';
import ScrollReveal from './components/ScrollReveal';

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
       <img src="/images/hero-bg.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, rgba(6,15,11,0.92) 0%, rgba(6,15,11,0.75) 55%, rgba(6,15,11,0.5) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 3, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 32px 80px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '560px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>ECONOMICS · ENERGY · POLICY</span>
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
              Rethinking energy <span style={{ color: '#f59e0b' }}>through economics</span>
            </h1>

            <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.75)', margin: '0 0 36px', maxWidth: '440px' }}>
              Examining how price signals, policy incentives, and household behaviour shape India&apos;s clean-energy transition.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/energy-survey" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Check Your Energy Use →
              </Link>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: '999px', border: '1px solid rgba(253,252,248,0.3)', color: 'rgba(253,252,248,0.85)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                About the project
              </Link>
            </div>

            <p style={{ marginTop: '48px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(253,252,248,0.35)' }}>
              Primary research · Data-driven analysis · Energy economics
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: '#0d2318', borderTop: '1px solid #1a4a2a', borderBottom: '1px solid #1a4a2a' }}>
        <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Households surveyed', value: '—' },
            { label: 'Essays published',    value: '—' },
            { label: 'Conversations',       value: '—' },
            { label: 'States covered',      value: '—' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '28px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid #1a4a2a' : 'none' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: '#7aaa8e', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="page-section" style={{ background: '#060f0b', padding: '80px 20px' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '16px' }}>The project</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '600', color: '#fdfcf8', lineHeight: 1.3, marginBottom: '20px' }}>
            India&apos;s energy transition is fundamentally an economics problem.
          </h2>
          <p style={{ fontSize: '18px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '28px' }}>
            Agastya Khanna is an Economics student whose research examines how household spending patterns, government subsidies, and market incentives determine whether families switch to clean energy — or don&apos;t.
          </p>
          <Link href="/about" style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', textDecoration: 'none' }}>
            Read more about the project →
          </Link>
        </div>
      </section>

      {/* ── CONTENT CARDS ── */}
      <section style={{ background: '#f5f0e8', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '32px' }}>Explore</p>
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { href: '/writings',      color: '#356452', label: 'Writings',      icon: '✍️', desc: "Essays on energy economics, subsidy reform, and India's policy landscape.",              cta: 'Read essays' },
              { href: '/conversations', color: '#b45309', label: 'Conversations', icon: '🎙️', desc: 'Interviews with researchers, policymakers, and households on the energy transition.',    cta: 'Watch videos' },
              { href: '/research',      color: '#1a5c42', label: 'Research',      icon: '📊', desc: 'Primary survey data on household energy consumption with findings and recommendations.', cta: 'See findings' },
            ].map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                className={`reveal reveal-${i + 2} hover-card`}
                style={{ display: 'block', padding: '32px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', borderTop: `4px solid ${card.color}`, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '16px' }}>{card.icon}</span>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '10px' }}>{card.label}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#5a6661', marginBottom: '20px' }}>{card.desc}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: card.color }}>{card.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT WRITINGS ── */}
      <section className="page-section" style={{ background: '#f5f0e8', padding: '0 32px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal reveal-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318' }}>Recent writings</h2>
            <Link href="/writings" style={{ fontSize: '14px', fontWeight: '500', color: '#356452', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { time: '5 min read', width: '60%' },
              { time: '8 min read', width: '75%' },
              { time: '6 min read', width: '85%' },
            ].map((w, i) => (
              <div
                key={i}
                className={`reveal reveal-${i + 2} hover-card`}
                style={{ padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ width: '100%', height: '4px', background: '#e5ddd0', borderRadius: '2px', marginBottom: '16px' }}>
                  <div style={{ width: w.width, height: '100%', background: '#c8b89a', borderRadius: '2px' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coming soon · {w.time}</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#c8b89a', marginBottom: '10px', lineHeight: 1.4 }}>Essay title will appear here</p>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#b0a898' }}>A short preview of the essay will show here once published through the admin panel.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT CONVERSATIONS ── */}
      <section className="page-section" style={{ background: '#f5f0e8', padding: '0 32px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal reveal-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318' }}>Recent conversations</h2>
            <Link href="/conversations" style={{ fontSize: '14px', fontWeight: '500', color: '#356452', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { type: 'Interview' },
              { type: 'Vlog' },
              { type: 'Interview' },
            ].map((c, i) => (
              <div
                key={i}
                className={`reveal reveal-${i + 2} hover-card`}
                style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a 0%, #0d2318 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '36px', opacity: 0.3 }}>▶</span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#b45309', marginBottom: '8px' }}>{c.type}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#c8b89a' }}>Conversation title will appear here</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="page-section" style={{ background: '#f5f0e8', padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="reveal reveal-1 cta-inner" style={{ background: '#0d2318', borderRadius: '20px', padding: '40px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#fdfcf8', marginBottom: '10px' }}>How does your home use energy?</h2>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#7aaa8e', maxWidth: '420px' }}>
                Take the 2-minute survey. Get a personalised breakdown of your household&apos;s energy consumption and tips to switch to clean energy.
              </p>
            </div>
            <Link href="/energy-survey" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none', flexShrink: 0 }}>
              Check Your Energy Use →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}