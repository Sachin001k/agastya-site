import Link from 'next/link';
import { getSiteContent, socialHref } from '@/lib/site-content';

export default async function Footer() {
  const year = new Date().getFullYear();
  const { contact, footer } = await getSiteContent();
  const socials = [
    { label: 'LinkedIn', href: socialHref('linkedin', contact.linkedin) },
    { label: 'X / Twitter', href: socialHref('twitter', contact.twitter) },
    { label: 'Instagram', href: socialHref('instagram', contact.instagram) },
  ].filter(s => s.href);

  return (
    <footer style={{ background: '#0d2318', borderTop: '1px solid #1a4a2a', marginTop: 'auto' }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <span style={{
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              fontSize: '44px',
              color: '#f59e0b',
              fontWeight: '400',
              lineHeight: 1,
              display: 'block',
              marginBottom: '12px'
            }}>
              AK
            </span>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#7aaa8e', maxWidth: '280px' }}>
              {footer.blurb}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#477e67', marginBottom: '16px' }}>Explore</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ href: '/about', label: 'About' }, { href: '/writings', label: 'Writings' }, { href: '/conversations', label: 'Conversations' }, { href: '/research', label: 'Research' }, { href: '/energy-survey', label: 'Take the survey' }].map(({ href, label }) => (
                <Link key={href} href={href} style={{ fontSize: '14px', color: '#7aaa8e', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#477e67', marginBottom: '16px' }}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contact.email && <a href={`mailto:${contact.email}`} style={{ fontSize: '14px', color: '#7aaa8e', textDecoration: 'none' }}>{contact.email}</a>}
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#7aaa8e', textDecoration: 'none' }}>{s.label}</a>
              ))}
              <Link href="/contact" style={{ fontSize: '14px', color: '#7aaa8e', textDecoration: 'none' }}>Send a message</Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #1a4a2a', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#477e67' }}>© {year} Agastya Khanna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}