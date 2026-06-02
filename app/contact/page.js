'use client';

import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject_type: 'general', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setStatus('loading');
    try {
      const { createClient } = await import('@/lib/supabase-client');
      const supabase = createClient();
      const { error } = await supabase.from('feedback_submissions').insert([{
        name: form.name || null, email: form.email || null,
        subject_type: form.subject_type, message: form.message,
      }]);
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', subject_type: 'general', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5ddd0', fontSize: '15px', color: '#0d2318', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' };

  return (
    <>
      <ScrollReveal />
      <style>{`
        @media (max-width: 768px) {
          .contact-hero { flex-direction: column !important; }
          .contact-hero-grid { grid-template-columns: 1fr !important; }
          .contact-form-grid { grid-template-columns: 1fr !important; }
          .contact-name-grid { grid-template-columns: 1fr !important; }
          .contact-subject-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: '#060f0b', padding: '72px 20px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>CONTACT</span>
          </div>
          <div className="contact-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-1px' }}>
                Get in <span style={{ color: '#f59e0b' }}>touch</span>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', maxWidth: '420px' }}>
                Whether you want to collaborate, share your energy story, give feedback on the research, or just say hello — Agastya would love to hear from you.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '✉️', label: 'Email',    value: 'hello@agastyakhanna.com', href: 'mailto:hello@agastyakhanna.com' },
                { icon: '🔗', label: 'LinkedIn', value: 'linkedin.com/in/agastyakhanna', href: '#' },
                { icon: '🐦', label: 'Twitter',  value: '@agastyakhanna', href: '#' },
              ].map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <div>
                    <p style={{ fontSize: '11px', color: '#7aaa8e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{c.label}</p>
                    <p style={{ fontSize: '14px', color: '#fdfcf8', margin: 0, fontWeight: '500' }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FORM + REASONS */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '64px', alignItems: 'start' }}>

            {/* Reasons */}
            <div className="reveal reveal-1">
              <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '24px' }}>Why people reach out</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: '🤝', title: 'Collaboration',      desc: 'Researchers, journalists, or organisations working on energy policy and climate.' },
                  { icon: '📊', title: 'Share your data',    desc: 'Households who want to share more detailed energy stories beyond the survey.' },
                  { icon: '💬', title: 'Feedback',           desc: 'Thoughts on the research, the essays, or the website itself.' },
                  { icon: '🎓', title: 'Academic enquiries', desc: 'Universities, professors, or students interested in the research methodology.' },
                  { icon: '👋', title: 'Just saying hello',  desc: "Anyone curious about the project or Agastya's work." },
                ].map((r) => (
                  <div key={r.title} style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{r.icon}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#0d2318', margin: '0 0 4px' }}>{r.title}</p>
                      <p style={{ fontSize: '13px', color: '#5a6661', margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="reveal reveal-2">
              {status === 'success' ? (
                <div style={{ padding: '48px 36px', borderRadius: '20px', background: '#fff', border: '1px solid #e5ddd0', textAlign: 'center' }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✅</span>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', marginBottom: '12px' }}>Message sent!</h2>
                  <p style={{ fontSize: '15px', color: '#5a6661', lineHeight: 1.7, marginBottom: '24px' }}>Thanks for reaching out. Agastya will get back to you soon.</p>
                  <button onClick={() => setStatus('idle')} style={{ padding: '12px 24px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: '36px', borderRadius: '20px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>Send a message</h2>
                  <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '28px' }}>Usually responds within 2–3 days.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="contact-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Name <span style={{ fontWeight: '400', color: '#8a948f' }}>— optional</span></label>
                        <input type="text" placeholder="Your name" style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Email <span style={{ fontWeight: '400', color: '#8a948f' }}>— optional</span></label>
                        <input type="email" placeholder="you@example.com" style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Subject</label>
                      <div className="contact-subject-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {[{value:'general',label:'General'},{value:'feedback',label:'Feedback'},{value:'collaboration',label:'Collaborate'},{value:'other',label:'Other'}].map((opt) => (
                          <div key={opt.value} onClick={() => update('subject_type', opt.value)} style={{ padding: '10px 8px', borderRadius: '10px', border: `2px solid ${form.subject_type === opt.value ? '#f59e0b' : '#e5ddd0'}`, background: form.subject_type === opt.value ? 'rgba(245,158,11,0.08)' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: form.subject_type === opt.value ? '#d97706' : '#5a6661' }}>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Message <span style={{ color: '#dc2626' }}>*</span></label>
                      <textarea placeholder="What would you like to say?" rows={5} required style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} value={form.message} onChange={e => update('message', e.target.value)} />
                    </div>
                    {status === 'error' && (
                      <p style={{ fontSize: '13px', color: '#dc2626', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                        Something went wrong. Please try again or email directly.
                      </p>
                    )}
                    <button type="submit" disabled={status === 'loading' || !form.message.trim()} style={{ padding: '14px 28px', borderRadius: '999px', background: form.message.trim() ? '#f59e0b' : '#e5ddd0', color: form.message.trim() ? '#060f0b' : '#8a948f', fontSize: '14px', fontWeight: '700', border: 'none', cursor: form.message.trim() ? 'pointer' : 'not-allowed', alignSelf: 'flex-start' }}>
                      {status === 'loading' ? 'Sending...' : 'Send message →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#060f0b', padding: '64px 20px' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Prefer to take action first?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            The best way to contribute to the research is to take the household energy survey. It takes 2 minutes and your data directly shapes the findings.
          </p>
          <a href="/energy-survey" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
            Check Your Energy Use →
          </a>
        </div>
      </section>
    </>
  );
}