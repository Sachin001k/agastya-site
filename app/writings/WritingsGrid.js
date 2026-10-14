'use client';

import Link from 'next/link';
import { useState } from 'react';
import ReadPdfButton from '../components/PdfViewer';

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

export default function WritingsGrid({ writings }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const uniqueTags = Array.from(new Set(writings.flatMap(w => w.tags || [])));
  const tags = ['All', ...uniqueTags];

  const filteredWritings = selectedTag === 'All'
    ? writings
    : writings.filter(w => w.tags?.includes(selectedTag));

  return (
    <>
      {/* ── FILTER TAGS ── */}
      {writings.length > 0 && (
        <section style={{ background: '#f5f0e8', padding: '28px 32px', borderBottom: '1px solid #e5ddd0', position: 'sticky', top: '88px', zIndex: 30 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#8a948f', marginRight: '8px', fontWeight: '500' }}>Filter:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  background: selectedTag === tag ? '#0d2318' : '#fff',
                  color: selectedTag === tag ? '#fdfcf8' : '#5a6661',
                  border: '1px solid',
                  borderColor: selectedTag === tag ? '#0d2318' : '#e5ddd0',
                  transition: 'all 0.2s ease',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── WRITINGS GRID ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredWritings.length > 0 ? (
            // key: rebuild the grid on filter change so the cards' fade-in runs again
            <div key={selectedTag} className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {filteredWritings.map((w, i) => {
                const stripped = stripHtml(w.content);
                const excerpt = w.excerpt || (stripped.length > 140 ? `${stripped.slice(0, 140)}…` : stripped);
                const width = `${Math.min(95, 40 + (w.reading_time || 5) * 6)}%`;
                return (
                  <div
                    key={w.slug}
                    className={`reveal reveal-${Math.min(i + 1, 4)} hover-card`}
                    style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ width: '100%', height: '3px', background: '#e5ddd0', borderRadius: '2px', marginBottom: '20px' }}>
                      <div style={{ width, height: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', borderRadius: '2px' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#356452', background: '#f0f7f4', padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {w.tags?.[0] || 'Essay'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8a948f' }}>{w.reading_time || 1} min read</span>
                    </div>

                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '19px', fontWeight: '600', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                      <Link href={`/writings/${w.slug}`} style={{ color: '#0d2318', textDecoration: 'none' }}>{w.title}</Link>
                    </h2>

                    <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5a6661', marginBottom: '20px' }}>
                      {excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #f0ebe0' }}>
                      <span style={{ fontSize: '12px', color: '#8a948f' }}>
                        {w.published_at ? new Date(w.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      {w.pdf_url ? (
                        <ReadPdfButton
                          url={w.pdf_url}
                          title={w.title}
                          style={{ padding: '7px 14px', borderRadius: '999px', background: '#0d2318', color: '#fdfcf8', fontSize: '12px', fontWeight: '600', border: 'none' }}
                        >
                          📄 Read essay
                        </ReadPdfButton>
                      ) : (
                        <Link href={`/writings/${w.slug}`} style={{ fontSize: '13px', fontWeight: '600', color: '#356452', textDecoration: 'none' }}>Read →</Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '64px 32px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c8b89a', marginBottom: '8px' }}>No essays in this category</p>
              <p style={{ fontSize: '14px', color: '#8a948f' }}>Try selecting a different filter or view all essays.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
