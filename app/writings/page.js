import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

async function getPublishedWritings() {
  const supabase = createClient();
  const { data } = await supabase
    .from('writings')
    .select('id, title, slug, excerpt, content, tags, reading_time, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function WritingsPage() {
  const writings = await getPublishedWritings();
  const uniqueTags = Array.from(new Set(writings.flatMap(w => w.tags || [])));
  const tags = ['All', ...uniqueTags];

  return (
    <>
      <ScrollReveal />

      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '72px 32px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>WRITINGS</span>
          </div>
          <div className='two-col-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-1px' }}>
                Essays &amp; <span style={{ color: '#f59e0b' }}>writings</span>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', maxWidth: '420px' }}>
                Long-form essays on energy economics, subsidy reform, and India&apos;s path to a clean-energy future.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
              <p style={{ fontSize: '13px', color: '#7aaa8e' }}>
                Essays are added by the scholar through the admin panel.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{writings.length || '—'}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>Essays published</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{uniqueTags.length || '—'}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>Topics covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER TAGS ── */}
      {writings.length > 0 && (
        <section style={{ background: '#f5f0e8', padding: '28px 32px', borderBottom: '1px solid #e5ddd0', position: 'sticky', top: '88px', zIndex: 30 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#8a948f', marginRight: '8px', fontWeight: '500' }}>Filter:</span>
            {tags.map((tag, i) => (
              <span
                key={tag}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: i === 0 ? '#0d2318' : '#fff',
                  color: i === 0 ? '#fdfcf8' : '#5a6661',
                  border: '1px solid',
                  borderColor: i === 0 ? '#0d2318' : '#e5ddd0',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── WRITINGS GRID ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {writings.length > 0 ? (
            <div className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {writings.map((w, i) => {
                const stripped = stripHtml(w.content);
                const excerpt = w.excerpt || (stripped.length > 140 ? `${stripped.slice(0, 140)}…` : stripped);
                const width = `${Math.min(95, 40 + (w.reading_time || 5) * 6)}%`;
                return (
                  <Link
                    key={w.slug}
                    href={`/writings/${w.slug}`}
                    className={`reveal reveal-${Math.min(i + 1, 4)} hover-card`}
                    style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
                  >
                    {/* Progress bar */}
                    <div style={{ width: '100%', height: '3px', background: '#e5ddd0', borderRadius: '2px', marginBottom: '20px' }}>
                      <div style={{ width, height: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', borderRadius: '2px' }} />
                    </div>

                    {/* Tag + time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#356452', background: '#f0f7f4', padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {w.tags?.[0] || 'Essay'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8a948f' }}>{w.reading_time || 1} min read</span>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '19px', fontWeight: '600', color: '#0d2318', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                      {w.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5a6661', marginBottom: '20px' }}>
                      {excerpt}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f0ebe0' }}>
                      <span style={{ fontSize: '12px', color: '#8a948f' }}>
                        {w.published_at ? new Date(w.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#356452' }}>Read →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '64px 32px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c8b89a', marginBottom: '8px' }}>No essays published yet</p>
              <p style={{ fontSize: '14px', color: '#8a948f' }}>Check back soon — essays are added through the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#060f0b', padding: '80px 20px' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Want to contribute to the research?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            Take the household energy survey and help build the data behind these essays.
          </p>
          <Link
            href="/energy-survey"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}
          >
            Check Your Energy Use →
          </Link>
        </div>
      </section>
    </>
  );
}
