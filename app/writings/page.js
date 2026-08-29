import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import WritingsGrid from './WritingsGrid';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60;

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
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{writings.length}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>Essays published</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{uniqueTags.length}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>Topics covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WritingsGrid writings={writings} />

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
