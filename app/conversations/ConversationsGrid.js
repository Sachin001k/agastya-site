'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ConversationsGrid({ conversations }) {
  const [selectedType, setSelectedType] = useState('All');

  // Filter buttons are plural ("Interviews"), conversation types are singular ("Interview")
  const filteredConversations = selectedType === 'All'
    ? conversations
    : conversations.filter(c => `${c.type}s` === selectedType);

  const interviewCount = conversations.filter(c => c.type === 'Interview').length;
  const vlogCount = conversations.filter(c => c.type === 'Vlog').length;
  const totalMins = Math.round(conversations.reduce((sum, c) => sum + c.seconds, 0) / 60);

  return (
    <>
      {/* ── STATS ── */}
      <div className='conv-stats' style={{ display: 'flex', gap: '24px', justifyContent: 'flex-end', marginBottom: '36px' }}>
        {[
          { label: 'Interviews', value: interviewCount },
          { label: 'Vlogs', value: vlogCount },
          { label: 'Total mins', value: totalMins },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── TYPE FILTER ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '36px' }}>
        {['All', 'Interviews', 'Vlogs'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              background: selectedType === type ? '#f59e0b' : '#fff',
              color: selectedType === type ? '#060f0b' : '#5a6661',
              border: '1px solid',
              borderColor: selectedType === type ? '#f59e0b' : '#e5ddd0',
              transition: 'all 0.2s ease',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      {/* key: rebuild the grid on filter change so the cards' fade-in runs again */}
      <div key={selectedType} className='cards-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c, i) => (
            <Link
              key={c.slug}
              href={`/conversations/${c.slug}`}
              className={`reveal reveal-${Math.min(i + 1, 4)} hover-card`}
              style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a4a2a 0%, #060f0b 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.thumbnail && (
                  <img src={c.thumbnail} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                )}
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(245,158,11,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(245,158,11,0.4)', position: 'relative' }}>
                  <span style={{ fontSize: '20px', marginLeft: '4px' }}>▶</span>
                </div>
                {c.duration && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '3px 8px' }}>
                    <span style={{ fontSize: '11px', color: '#fff', fontWeight: '500' }}>{c.duration}</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: c.type === 'Interview' ? 'rgba(53,100,82,0.9)' : 'rgba(180,83,9,0.9)', borderRadius: '4px', padding: '3px 10px' }}>
                  <span style={{ fontSize: '11px', color: '#fff', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.type}</span>
                </div>
              </div>

              <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '12px', color: '#8a948f', marginBottom: '8px' }}>{c.guest}</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#0d2318', lineHeight: 1.4, marginBottom: '10px', flex: 1 }}>
                  {c.title}
                </h2>
                {c.desc && (
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#5a6661', marginBottom: '16px' }}>
                    {c.desc}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f0ebe0' }}>
                  <span style={{ fontSize: '12px', color: '#8a948f' }}>{c.duration ? `${c.duration} watch` : ''}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#b45309' }}>Watch →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '64px 32px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#c8b89a', marginBottom: '8px' }}>No {selectedType === 'All' ? 'conversations' : selectedType.toLowerCase()} yet</p>
            <p style={{ fontSize: '14px', color: '#8a948f' }}>Check back soon for new content.</p>
          </div>
        )}
      </div>
    </>
  );
}
