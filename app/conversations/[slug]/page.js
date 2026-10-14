import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { getVideoEmbed, formatDuration } from '@/lib/video';

export const revalidate = 60;

async function getConversation(slug) {
  const supabase = createClient();
  const { data } = await supabase
    .from('conversations')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

async function getMoreConversations(slug) {
  const supabase = createClient();
  const { data } = await supabase
    .from('conversations')
    .select('title, slug, type, video_url, duration_seconds')
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3);
  return data || [];
}

function typeLabel(type) {
  return type === 'vlog' ? 'Vlog' : 'Interview';
}

export default async function ConversationDetailPage({ params }) {
  const conversation = await getConversation(params.slug);
  if (!conversation) notFound();

  const more = await getMoreConversations(params.slug);
  const video = getVideoEmbed(conversation.video_url);
  const duration = formatDuration(conversation.duration_seconds);

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
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', background: conversation.type === 'vlog' ? 'rgba(180,83,9,0.8)' : 'rgba(53,100,82,0.8)', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {typeLabel(conversation.type)}
            </span>
            {duration && <span style={{ fontSize: '11px', color: '#7aaa8e' }}>{duration} watch</span>}
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', lineHeight: 1.15, color: '#fdfcf8', margin: '0 0 20px', letterSpacing: '-0.5px' }}>
            {conversation.title}
          </h1>

          {conversation.guest_name && (
            <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.6)', maxWidth: '600px', margin: 0 }}>
              with <span style={{ color: '#fcd34d', fontWeight: '600' }}>{conversation.guest_name}</span>
            </p>
          )}
        </div>
      </section>

      {/* ── VIDEO PLAYER ── */}
      <section style={{ background: '#0d2318', padding: '48px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: '#060f0b', border: '1px solid #1a4a2a' }}>
            {video?.kind === 'iframe' ? (
              <iframe
                src={video.src}
                title={conversation.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              />
            ) : video?.kind === 'file' ? (
              <video src={video.src} controls preload="metadata" style={{ width: '100%', height: '100%', display: 'block' }} />
            ) : null}
          </div>
          {conversation.video_url && (
            <p style={{ fontSize: '12px', color: '#477e67', marginTop: '12px', textAlign: 'right' }}>
              Video not loading?{' '}
              <a href={conversation.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#7aaa8e' }}>Open it in a new tab →</a>
            </p>
          )}
        </div>
      </section>

      {/* ── DESCRIPTION + TRANSCRIPT ── */}
      {(conversation.description || conversation.guest_bio || conversation.transcript) && (
        <section style={{ background: '#fdfcf8', padding: '64px 32px 80px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {conversation.description && (
              <>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '16px' }}>
                  About this conversation
                </h2>
                <p style={{ fontSize: '17px', lineHeight: 1.8, color: '#2b332e', whiteSpace: 'pre-line' }}>{conversation.description}</p>
              </>
            )}

            {conversation.guest_bio && (
              <div style={{ marginTop: '40px', padding: '24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#356452', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>About the guest</p>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#2b332e', whiteSpace: 'pre-line', margin: 0 }}>{conversation.guest_bio}</p>
              </div>
            )}

            {conversation.transcript && (
              <details style={{ marginTop: '32px', padding: '20px 24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
                <summary style={{ fontSize: '14px', fontWeight: '600', color: '#0d2318', cursor: 'pointer' }}>Read the transcript</summary>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#2b332e', whiteSpace: 'pre-line', marginTop: '16px' }}>{conversation.transcript}</p>
              </details>
            )}
          </div>
        </section>
      )}

      {/* ── MORE CONVERSATIONS ── */}
      {more.length > 0 && (
        <section style={{ background: '#f5f0e8', padding: '64px 32px 80px', borderTop: '1px solid #e5ddd0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
              More conversations
            </h3>
            <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {more.map((c) => {
                const thumb = getVideoEmbed(c.video_url)?.thumbnail;
                const mins = formatDuration(c.duration_seconds);
                return (
                  <Link
                    key={c.slug}
                    href={`/conversations/${c.slug}`}
                    className="hover-card"
                    style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textDecoration: 'none' }}
                  >
                    <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a, #060f0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {thumb && <img src={thumb} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />}
                      <span style={{ fontSize: '24px', opacity: 0.8, color: '#fff', position: 'relative' }}>▶</span>
                      {mins && (
                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 7px' }}>
                          <span style={{ fontSize: '11px', color: '#fff' }}>{mins}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#b45309', marginBottom: '6px' }}>{typeLabel(c.type)}</p>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '600', color: '#0d2318' }}>{c.title}</p>
                    </div>
                  </Link>
                );
              })}
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
      )}
    </>
  );
}
