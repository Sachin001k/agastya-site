import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

async function getWriting(slug) {
  const supabase = createClient();
  const { data } = await supabase
    .from('writings')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

async function getRelatedWritings(slug) {
  const supabase = createClient();
  const { data } = await supabase
    .from('writings')
    .select('title, slug, tags')
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);
  return data || [];
}

export default async function WritingDetailPage({ params }) {
  const writing = await getWriting(params.slug);
  if (!writing) notFound();

  const related = await getRelatedWritings(params.slug);

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
              {writing.tags?.[0] || 'Essay'}
            </span>
            <span style={{ fontSize: '11px', color: '#7aaa8e' }}>{writing.reading_time || 1} min read</span>
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '700', lineHeight: 1.15, color: '#fdfcf8', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            {writing.title}
          </h1>

          {writing.excerpt && (
            <p style={{ fontSize: '18px', lineHeight: 1.75, color: 'rgba(253,252,248,0.6)', marginBottom: '32px' }}>
              {writing.excerpt}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}>AK</span>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fdfcf8', margin: 0 }}>Agastya Khanna</p>
                <p style={{ fontSize: '12px', color: '#7aaa8e', margin: 0 }}>
                  {writing.published_at ? new Date(writing.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} · {writing.reading_time || 1} min read
                </p>
              </div>
            </div>

            {writing.pdf_url && (
              <a
                href={writing.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none', flexShrink: 0 }}
              >
                📄 Download PDF
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ background: '#fdfcf8', padding: '64px 32px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {writing.content ? (
            <div
              style={{ fontSize: '17px', lineHeight: 1.8, color: '#2b332e' }}
              dangerouslySetInnerHTML={{ __html: writing.content }}
            />
          ) : (
            <p style={{ fontSize: '15px', color: '#8a948f' }}>This essay has no content yet.</p>
          )}

          {writing.pdf_url && (
            <div style={{ padding: '24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0', marginTop: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#5a6661', marginBottom: '12px' }}>This essay includes a full PDF report with charts and data.</p>
              <a
                href={writing.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', background: '#0d2318', color: '#fdfcf8', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
              >
                📄 Download the full PDF
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section style={{ background: '#f5f0e8', padding: '64px 32px 80px', borderTop: '1px solid #e5ddd0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
              More writings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {related.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/writings/${r.slug}`}
                  className="hover-card"
                  style={{ padding: '24px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textDecoration: 'none' }}
                >
                  <div style={{ width: '100%', height: '3px', background: '#e5ddd0', borderRadius: '2px', marginBottom: '16px' }}>
                    <div style={{ width: `${55 + i * 15}%`, height: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', borderRadius: '2px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.tags?.[0] || 'Essay'}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '600', color: '#0d2318' }}>{r.title}</p>
                </Link>
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
      )}
    </>
  );
}
