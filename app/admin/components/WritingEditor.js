'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function estimateReadingTime(content) {
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default function WritingEditor({ initialData }) {
  const router = useRouter();
  const isNew = !initialData?.id;

  const [form, setForm] = useState({
    title:       initialData?.title       || '',
    slug:        initialData?.slug        || '',
    excerpt:     initialData?.excerpt     || '',
    content:     initialData?.content     || '',
    tags:        initialData?.tags?.join(', ') || '',
    is_published:initialData?.is_published || false,
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
    setSaving(true); setError('');
    const supabase = createClient();
    const payload = {
      title:        form.title,
      slug:         form.slug || slugify(form.title),
      excerpt:      form.excerpt || null,
      content:      form.content || null,
      tags:         form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      reading_time: estimateReadingTime(form.content),
      is_published: publish !== null ? publish : form.is_published,
      published_at: (publish || form.is_published) ? new Date().toISOString() : null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('writings').insert([payload]));
    } else {
      ({ error } = await supabase.from('writings').update(payload).eq('id', initialData.id));
    }

    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (isNew) router.push('/admin/writings');
    else if (publish !== null) setForm(prev => ({ ...prev, is_published: publish }));
  };

  const handleDelete = async () => {
    if (!confirm('Delete this essay? This cannot be undone.')) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('writings').delete().eq('id', initialData.id);
    router.push('/admin/writings');
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5ddd0', fontSize: '14px', color: '#0d2318', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#5a6661', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/writings" style={{ fontSize: '13px', color: '#8a948f', textDecoration: 'none' }}>← Writings</Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', margin: 0 }}>
            {isNew ? 'New essay' : 'Edit essay'}
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
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Title *</label>
              <input type="text" placeholder="Essay title" style={{ ...inputStyle, fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: '600' }} value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input type="text" style={inputStyle} value={form.slug} onChange={e => update('slug', e.target.value)} />
              <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '4px' }}>agastyakhanna.com/writings/{form.slug || 'your-slug'}</p>
            </div>
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Excerpt</label>
            <textarea rows={3} placeholder="Short preview shown on the listings page..." style={{ ...inputStyle, resize: 'vertical' }} value={form.excerpt} onChange={e => update('excerpt', e.target.value)} />
          </div>

          <div style={{ padding: '24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Content</label>
            <textarea
              rows={20}
              placeholder="Write your essay here... (HTML is supported for formatting)"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'Georgia, serif', fontSize: '15px' }}
              value={form.content}
              onChange={e => update('content', e.target.value)}
            />
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '4px' }}>
              Estimated reading time: {estimateReadingTime(form.content)} min · {form.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#5a6661', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', background: form.is_published ? '#f0f7f4' : '#fef9ec', border: `1px solid ${form.is_published ? '#bbd7c8' : '#fde68a'}` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: form.is_published ? '#356452' : '#b45309', display: 'inline-block' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: form.is_published ? '#356452' : '#b45309' }}>{form.is_published ? 'Published' : 'Draft'}</span>
            </div>
          </div>

          <div style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <label style={labelStyle}>Tags</label>
            <input type="text" placeholder="energy, policy, solar" style={inputStyle} value={form.tags} onChange={e => update('tags', e.target.value)} />
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '4px' }}>Comma separated</p>
          </div>

          {!isNew && form.is_published && (
            <div style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#5a6661', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Published URL</p>
              <Link href={`/writings/${form.slug}`} target="_blank" style={{ fontSize: '12px', color: '#356452', textDecoration: 'none', wordBreak: 'break-all' }}>
                /writings/{form.slug} ↗
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
