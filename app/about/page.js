import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';

export default function AboutPage() {
  return (
    <>
      <ScrollReveal />

      {/* ── HERO ── */}
      <section className="page-section" style={{ background: '#060f0b', padding: '80px 32px 0', overflow: 'hidden', position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div className="about-hero-grid" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

          {/* LEFT — text */}
          <div style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '28px', background: 'rgba(245,158,11,0.08)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>ABOUT</span>
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 4vw, 4.5rem)', fontWeight: '700', lineHeight: 1.05, color: '#fdfcf8', margin: '0 0 24px', letterSpacing: '-1px' }}>
              Agastya<br /><span style={{ color: '#f59e0b' }}>Khanna</span>
            </h1>

            <p style={{ fontSize: '20px', fontWeight: '500', color: '#7aaa8e', marginBottom: '20px', lineHeight: 1.5 }}>
              Economics Student &amp; Energy Researcher
            </p>

            <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'rgba(253,252,248,0.65)', marginBottom: '36px', maxWidth: '460px' }}>
              Agastya Khanna is a high-school student with a deep interest in economics and the future of energy. His work focuses on how policy, behaviour, and technology come together to enable India&apos;s shift toward renewable sources.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/writings" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Read his writings →
              </Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 26px', borderRadius: '999px', border: '1px solid rgba(253,252,248,0.2)', color: 'rgba(253,252,248,0.75)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
                Get in touch
              </Link>
            </div>
          </div>

          {/* RIGHT — sun animation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '80px' }}>
            <svg
              viewBox="0 0 600 600"
              style={{ width: '100%', maxWidth: '560px' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="aGlow1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="50%"  stopColor="#f59e0b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="aGlow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
                </radialGradient>
              </defs>

              <style>{`
                @keyframes aRise {
                  from { transform: translateY(70px); opacity: 0; }
                  to   { transform: translateY(0); opacity: 1; }
                }
                @keyframes aRaySpin {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(-360deg); }
                }
                @keyframes aGlow {
                  0%,100% { opacity: 0.45; }
                  50%     { opacity: 0.85; }
                }
                @keyframes aGlow2 {
                  0%,100% { opacity: 0.25; }
                  50%     { opacity: 0.55; }
                }
                @keyframes aPulse {
                  0%,100% { r: 76px; }
                  50%     { r: 82px; }
                }
                @keyframes aParticle {
                  0%   { opacity: 0; transform: translate(0,0); }
                  20%  { opacity: 1; }
                  100% { opacity: 0; transform: translate(var(--adx), var(--ady)); }
                }
                .a-sun-group { animation: aRise 1.6s cubic-bezier(.16,1,.3,1) both 0.3s; }
                .a-rays      { transform-origin: 300px 300px; animation: aRaySpin 28s linear infinite; }
                .a-glow1     { animation: aGlow  5s ease-in-out infinite; }
                .a-glow2     { animation: aGlow2 5s ease-in-out infinite 1.5s; }
                .a-particle  { animation: aParticle 4.5s ease-in-out infinite; }
              `}</style>

              {/* Large outer glow — like home page */}
              <ellipse className="a-glow1" cx="300" cy="300" rx="260" ry="260" fill="url(#aGlow1)" />
              <ellipse className="a-glow2" cx="300" cy="300" rx="160" ry="160" fill="url(#aGlow2)" />

              <g className="a-sun-group">
                {/* Single layer of rays — 16 evenly spaced, slow spin */}
                <g className="a-rays">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line
                      key={i}
                      x1="300" y1="96" x2="300" y2="148"
                      stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.55"
                      transform={`rotate(${i * 22.5}, 300, 300)`}
                    />
                  ))}
                </g>

                {/* Sun body */}
                <circle cx="300" cy="300" r="88"  fill="#f59e0b" opacity="0.12" />
                <circle cx="300" cy="300" r="76"  fill="#f59e0b" />
                <circle cx="300" cy="300" r="58"  fill="#fbbf24" />
                <circle cx="300" cy="300" r="36"  fill="#fde68a" />
                <circle cx="300" cy="300" r="16"  fill="#fff8e1" />
              </g>

              {/* Particles — spread far across the full SVG */}
              {[
                { cx:  60, cy:  80, r: 3,   dx: '-55px', dy: '-55px', delay: '0s'   },
                { cx: 160, cy:  40, r: 2,   dx: '-20px', dy: '-70px', delay: '0.8s' },
                { cx: 300, cy:  30, r: 2.5, dx:   '0px', dy: '-80px', delay: '2.0s' },
                { cx: 450, cy:  60, r: 2,   dx:  '40px', dy: '-60px', delay: '1.3s' },
                { cx: 540, cy: 150, r: 3,   dx:  '65px', dy: '-30px', delay: '0.4s' },
                { cx: 570, cy: 300, r: 2,   dx:  '75px', dy:   '0px', delay: '1.9s' },
                { cx: 540, cy: 450, r: 2.5, dx:  '55px', dy:  '55px', delay: '1.1s' },
                { cx: 440, cy: 540, r: 2,   dx:  '30px', dy:  '70px', delay: '2.5s' },
                { cx: 300, cy: 570, r: 3,   dx:   '0px', dy:  '75px', delay: '0.6s' },
                { cx: 150, cy: 545, r: 2,   dx: '-40px', dy:  '65px', delay: '1.7s' },
                { cx:  55, cy: 440, r: 2.5, dx: '-65px', dy:  '45px', delay: '2.3s' },
                { cx:  30, cy: 300, r: 2,   dx: '-75px', dy:   '0px', delay: '0.9s' },
                { cx:  55, cy: 160, r: 3,   dx: '-60px', dy: '-40px', delay: '1.5s' },
              ].map((p, i) => (
                <circle
                  key={i}
                  className="a-particle"
                  cx={p.cx} cy={p.cy} r={p.r}
                  fill={i % 2 === 0 ? '#f59e0b' : '#fde68a'}
                  style={{ '--adx': p.dx, '--ady': p.dy, animationDelay: p.delay }}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* ── BIO SECTION ── */}
      <section style={{ background: '#f5f0e8', padding: '80px 20px' }}>
        <div className="bio-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>

          {/* Photo placeholder */}
          <div className="reveal reveal-1">
            <div style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #0d2318, #1a4a2a)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #2a6b4a' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '2px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>AK</span>
              </div>
              <p style={{ fontSize: '12px', color: '#7aaa8e', letterSpacing: '1px' }}>Photo coming soon</p>
            </div>
          </div>

          {/* Bio text */}
          <div className="reveal reveal-2">
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '16px' }}>Background</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', lineHeight: 1.3, marginBottom: '20px' }}>
              An economist&apos;s lens on India&apos;s energy future
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#5a6661', marginBottom: '20px' }}>
              Agastya Khanna is a high-school student whose academic interests sit at the intersection of economics and environmental policy. Growing up in India, he became increasingly curious about why clean energy adoption — despite its obvious benefits — remains slow and uneven across households and regions.
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#5a6661', marginBottom: '20px' }}>
              His research takes an economics-first approach: rather than treating energy transition as a purely technical problem, he examines the price signals, subsidy structures, and behavioural incentives that shape real household decisions.
            </p>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#5a6661' }}>
              This website documents that ongoing research journey — from early essays to field data to conversations with people working on these problems every day.
            </p>

            <div className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '36px' }}>
              {[
                { label: 'Major',    value: 'Economics' },
                { label: 'Focus',    value: 'Energy Policy' },
                { label: 'Location', value: 'India' },
              ].map((fact) => (
                <div key={fact.label} style={{ padding: '16px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#8a948f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{fact.label}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#0d2318' }}>{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ background: '#fff', padding: '80px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Journey</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '48px' }}>
            Academic &amp; research milestones
          </h2>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, #f59e0b, #1a4a2a)', opacity: 0.3 }} />
            {[
              { year: '2024', title: 'Began energy economics research',  desc: 'Started exploring household energy consumption patterns and their economic drivers across urban and rural India.' },
              { year: '2024', title: 'First essays published',            desc: 'Wrote initial pieces on subsidy reform and the economics of solar adoption, developing the analytical framework for future research.' },
              { year: '2025', title: 'Household survey launched',         desc: 'Designed and launched a primary research survey collecting energy consumption data from households across multiple Indian states.' },
              { year: '2025', title: 'Conversations series started',      desc: 'Began interviewing researchers, policymakers, and households to bring diverse perspectives to the research.' },
              { year: '2026', title: 'Applying to university',            desc: 'Pursuing undergraduate Economics programmes with a focus on environmental and development economics.' },
            ].map((item, i) => (
              <div key={i} className={`reveal reveal-${Math.min(i + 1, 4)}`} style={{ display: 'flex', gap: '32px', marginBottom: '40px', paddingLeft: '8px' }}>
                <div style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', border: '3px solid #f5f0e8', marginTop: '4px', zIndex: 1 }} />
                <div style={{ padding: '20px 24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0', flex: 1 }}>
                  <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 10px', borderRadius: '999px', marginBottom: '10px' }}>{item.year}</span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#5a6661' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section style={{ background: '#f5f0e8', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Recognition</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '36px' }}>
            Achievements &amp; awards
          </h2>
          <div className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[0, 1, 2].map((_, i) => (
              <div key={i} className={`reveal reveal-${i + 2} hover-card`} style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>🏆</span>
                </div>
                <p style={{ fontSize: '11px', color: '#8a948f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Achievement placeholder</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#c8b89a', marginBottom: '8px' }}>Award or achievement title</p>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#b0a898' }}>Details will be added once the scholar provides this information.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#060f0b', padding: '80px 20px' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Interested in the research?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            Explore the essays, conversations, and survey findings — or reach out directly.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/writings" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
              Read the essays →
            </Link>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 26px', borderRadius: '999px', border: '1px solid rgba(253,252,248,0.2)', color: 'rgba(253,252,248,0.75)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}