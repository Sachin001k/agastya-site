import { ImageResponse } from 'next/og';

// The preview image shown when a link to the site is shared (WhatsApp, LinkedIn, X…)
export const alt = 'Agastya Khanna — Economics & Energy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: 'linear-gradient(135deg, #060f0b 0%, #0d2318 60%, #1a4a2a 100%)', color: '#fdfcf8', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ fontSize: '26px', letterSpacing: '6px', color: '#fcd34d', fontFamily: 'sans-serif' }}>ECONOMICS · ENERGY · POLICY</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '84px', fontWeight: 700, lineHeight: 1.05 }}>Rethinking energy</div>
          <div style={{ fontSize: '84px', fontWeight: 700, lineHeight: 1.05, color: '#f59e0b' }}>through economics</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '34px', color: '#7aaa8e', fontFamily: 'sans-serif' }}>Agastya Khanna</div>
          <div style={{ fontSize: '26px', color: '#7aaa8e', fontFamily: 'sans-serif' }}>Essays · Conversations · Research</div>
        </div>
      </div>
    ),
    size,
  );
}
