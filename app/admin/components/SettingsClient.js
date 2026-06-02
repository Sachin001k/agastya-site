'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function SettingsClient({ initialSettings }) {
  const [form, setForm] = useState({
    hero_headline:    initialSettings?.hero_headline    || '',
    hero_subtext:     initialSettings?.hero_subtext     || '',
    about_bio:        initialSettings?.about_bio        || '',
    email:            initialSettings?.email            || '',
    social_twitter:   initialSettings?.social_twitter   || '',
    social_linkedin:  initialSettings?.social_linkedin  || '',
    social_instagram: initialSettings?.social_instagram || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true); setError('');
    const supabase = createClient();
    const { error } = await supabase
      .from('site_settings')
      .update({
        hero_headline:    form.hero_headline    || null,
        hero_subtext:     form.hero_subtext     || null,
        about_bio:        form.about_bio        || null,
        email:            form.email            || null,
        social_twitter:   form.social_twitter   || null,
        social_linkedin:  form.social_linkedin  || null,
        social_instagram: form.social_instagram || null,
      })
      .eq('id', initialSettings.id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5ddd0', fontSize: '14px', color: '#0d2318', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#5a6661', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>Site settings</h1>
          <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px' }}>Edit homepage content, contact info, and social links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '10px 24px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      {error && <p style={{ fontSize: '13px', color: '#dc2626', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Hero */}
        <div style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>Homepage hero</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Main headline</label>
              <input type="text" placeholder="Rethinking energy through economics" style={inputStyle} value={form.hero_headline} onChange={e => update('hero_headline', e.target.value)} />
              <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '4px' }}>Leave blank to use the default headline.</p>
            </div>
            <div>
              <label style={labelStyle}>Sub-headline</label>
              <textarea rows={2} placeholder="A high-school researcher exploring..." style={{ ...inputStyle, resize: 'vertical' }} value={form.hero_subtext} onChange={e => update('hero_subtext', e.target.value)} />
            </div>
          </div>
        </div>

        {/* About */}
        <div style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>About page bio</p>
          <textarea rows={6} placeholder="Agastya Khanna is a high-school student..." style={{ ...inputStyle, resize: 'vertical' }} value={form.about_bio} onChange={e => update('about_bio', e.target.value)} />
        </div>

        {/* Contact */}
        <div style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>Contact &amp; social</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="hello@agastyakhanna.com" style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Twitter / X URL</label>
              <input type="url" placeholder="https://twitter.com/..." style={inputStyle} value={form.social_twitter} onChange={e => update('social_twitter', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input type="url" placeholder="https://linkedin.com/in/..." style={inputStyle} value={form.social_linkedin} onChange={e => update('social_linkedin', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Instagram URL</label>
              <input type="url" placeholder="https://instagram.com/..." style={inputStyle} value={form.social_instagram} onChange={e => update('social_instagram', e.target.value)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
