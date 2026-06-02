'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function detectSource(url) {
  if (!url) return 'youtube';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo')) return 'vimeo';
  return 'upload';
}

export default function ConversationEditor({ initialData }) {
  const router = useRouter();
  const isNew = !initialData?.id;

  const [form, setForm] = useState({
    title:            initialData?.title            || '',
    slug:             initialData?.slug             || '',
    type:             initialData?.type             || 'interview',
    description:      initialData?.description      || '',
    video_url:        initialData?.video_url        || '',
    guest_name:       initialData?.guest_name       || '',
    guest_bio:        initialData?.guest_bio        || '',
    duration_seconds: initialData?.duration_seconds || '',
    transcript:       initialData?.transcript       || '',
    is_published:     initialData?.is_published     || false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && isNew) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = async (publish = null) => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.video_url.trim()) { setError('Video URL is required.'); return; }
    setSaving(true); setError('');
    const supabase = createClient();
    const payload = {
      title:            form.title,
      slug:             form.slug || slugify(form.title),
      type:             form.type,
      description:      form.description || null,
      video_url:        form.video_url,
      video_source:     detectSource(form.video_url),
      guest_name:       form.guest_name || null,
      guest_bio:        form.guest_bio  || null,
      duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) * 60 : null,
      transcript:       form.transcript || null,
      is_published:     publish !== null ? publish : form.is_published,
      published_at:     (publish || form.is_published) ? new Date().toISOString() : null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('conversations').insert([payload]));
    } else {
      ({ error } = await supabase.from('conversations').update(payload).eq('id', initialData.id));
    }

    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isNew) router.push('/admin/conversations');
    else if (publish !== null) setForm(prev => ({ ...prev, is_published: publish }));
  };

  const handleDelete = async () => {
    if (!confirm('Delete this conversation? This cannot be undone.')) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('conversations').delete().eq('id', initialData.id);
    router.push('/admin/conversations');
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5ddd0', fontSize: '14px', color: '#0d2318', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#5a6661', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/conversations" style={{ fontSize: '13px', color: '#8a948f', textDecoration: 'none' }}>← Conversations</Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', margin: 0 }}>
            {isNew ? 'Add conversation' : 'Edit conversation'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!isNew && (
            <button onClick={handleDelete} disabled={deleting} style={{ padding: '9px 16px', borderRadius: '8px', background: '#fff', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving} style={{ padding: '9px 16px', borderRadius: '8px', background: '#f5f0e8', border: '1px solid #e5ddd0', color: '#0d2318', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save draft'}
          </button>
          <button onClick={() => handleSave(!form.is_published)} disabled={saving} style={{ padding: '9px 16px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
            {form.is_published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <p style={{ fontSize: '13px', color: '#dc2626', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fecaca' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['interview', 'vlog'].map(t => (
                  <div key={t} onClick={() => update('type', t)} style={{ padding: '10px 20px', borderRadius: '999px', border: `2px solid ${form.type === t ? '#f59e0b' : '#e5ddd0'}`, background: form.type === t ? 'rgba(245,158,11,0.08)' : '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: form.type === t ? '#d97706' : '#5a6661', textTransform: 'capitalize' }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Title *</label>
              <input type="text" placeholder="Conversation title" style={{ ...inputStyle, fontSize: '17px', fontFamily: 'Georgia, serif', fontWeight: '600' }} value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input type="text" style={inputStyle} value={form.slug} onChange={e => update('slug', e.target.value)} />
            </div>
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Video URL * (YouTube, Vimeo, or direct link)</label>
            <input type="url" placeholder="https://youtube.com/watch?v=..." style={inputStyle} value={form.video_url} onChange={e => update('video_url', e.target.value)} />
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '6px' }}>
              Detected source: <strong>{detectSource(form.video_url)}</strong>
            </p>
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Description</label>
            <textarea rows={4} placeholder="What is this conversation about?" style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={e => update('description', e.target.value)} />
          </div>

          {form.type === 'interview' && (
            <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Guest name</label>
                <input type="text" placeholder="Dr. Jane Smith" style={inputStyle} value={form.guest_name} onChange={e => update('guest_name', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Guest bio</label>
                <textarea rows={2} placeholder="Brief bio of the guest..." style={{ ...inputStyle, resize: 'vertical' }} value={form.guest_bio} onChange={e => update('guest_bio', e.target.value)} />
              </div>
            </div>
          )}

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Transcript (optional)</label>
            <textarea rows={8} placeholder="Paste the full transcript here..." style={{ ...inputStyle, resize: 'vertical', fontSize: '13px' }} value={form.transcript} onChange={e => update('transcript', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#5a6661', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', background: form.is_published ? '#f0f7f4' : '#fef9ec', border: `1px solid ${form.is_published ? '#bbd7c8' : '#fde68a'}` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: form.is_published ? '#356452' : '#b45309', display: 'inline-block' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: form.is_published ? '#356452' : '#b45309' }}>{form.is_published ? 'Published' : 'Draft'}</span>
            </div>
          </div>
          <div style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Duration (minutes)</label>
            <input type="number" placeholder="24" style={inputStyle} value={form.duration_seconds} onChange={e => update('duration_seconds', e.target.value)} />
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '4px' }}>Enter duration in minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
