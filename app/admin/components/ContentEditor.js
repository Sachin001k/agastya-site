'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, PageHeader, adminFetch, inputStyle, labelStyle, cardStyle, hintStyle } from './ui';

const TABS = [
  { key: 'home', label: 'Homepage', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'research', label: 'Research', href: '/research' },
  { key: 'contact', label: 'Contact & footer', href: '/contact' },
];

/* ── Small field components ── */

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

function Text({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} style={inputStyle} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />;
}

function Area({ value, onChange, rows = 3, placeholder }) {
  return <textarea rows={rows} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />;
}

function Section({ title, description, children }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '15px', fontWeight: '600', color: '#0d2318', margin: 0 }}>{title}</p>
      {description && <p style={{ ...hintStyle, marginTop: '4px' }}>{description}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>{children}</div>
    </div>
  );
}

// Editable list with add / remove / reorder. `fields` describes each item's inputs.
function ListEditor({ items, onChange, fields, addLabel, emptyText, newItem }) {
  const update = (i, key, value) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: value } : it)));
  const move = (i, dir) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = i => onChange(items.filter((_, j) => j !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.length === 0 && <p style={{ fontSize: '13px', color: '#8a948f', margin: 0, padding: '14px', background: '#fdfcf8', border: '1px dashed #e5ddd0', borderRadius: '10px' }}>{emptyText}</p>}
      {items.map((item, i) => (
        <div key={i} style={{ padding: '16px', borderRadius: '12px', background: '#fdfcf8', border: '1px solid #e5ddd0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#8a948f' }}>#{i + 1}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button small aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</Button>
              <Button small aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</Button>
              <Button small variant="danger" onClick={() => remove(i)}>Remove</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: fields.length > 1 ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr', gap: '12px' }}>
            {fields.map(f => (
              <div key={f.key} style={f.wide ? { gridColumn: '1 / -1' } : undefined}>
                <label style={labelStyle}>{f.label}</label>
                {f.multiline
                  ? <Area rows={f.rows || 2} value={item[f.key]} placeholder={f.placeholder} onChange={v => update(i, f.key, v)} />
                  : <Text value={item[f.key]} placeholder={f.placeholder} onChange={v => update(i, f.key, v)} />}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div>
        <Button onClick={() => onChange([...items, newItem()])}>+ {addLabel}</Button>
      </div>
    </div>
  );
}

function PhotoField({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async file => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', 'agastya');
      const { url } = await adminFetch('/api/admin/upload', { method: 'POST', formData });
      onChange(url);
      toast.success('Photo uploaded — click Save to publish it');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '120px', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(135deg, #0d2318, #1a4a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e5ddd0' }}>
        {value
          ? <img src={value} alt="About photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>AK</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => upload(e.target.files?.[0])} />
        <Button variant="dark" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}
        </Button>
        {value && <Button small variant="danger" onClick={() => onChange('')}>Remove photo</Button>}
        <p style={{ ...hintStyle, margin: 0 }}>JPG, PNG or WebP, under 5 MB. A portrait (3:4) works best.</p>
      </div>
    </div>
  );
}

/* ── Main editor ── */

export default function ContentEditor({ initialContent, defaults }) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [tab, setTab] = useState('home');
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (section, key, value) => setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const save = async () => {
    setSaving(true);
    try {
      const { content: saved } = await adminFetch('/api/admin/content', { method: 'PUT', body: { content } });
      setContent(saved);
      setSavedContent(saved);
      toast.success('Saved — the website is updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetSection = () => {
    const label = TABS.find(t => t.key === tab).label;
    if (!confirm(`Reset the ${label} section to its original text? You can still review it before saving.`)) return;
    setContent(prev => {
      const next = { ...prev, [tab]: defaults[tab] };
      if (tab === 'contact') next.footer = defaults.footer;
      return next;
    });
  };

  const current = TABS.find(t => t.key === tab);
  const home = content.home, about = content.about, research = content.research, contact = content.contact;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px' }}>
      <PageHeader
        title="Website content"
        subtitle="Edit the text and images on every page. Changes go live as soon as you save."
        actions={
          <>
            {dirty && <span style={{ fontSize: '12px', color: '#b45309', fontWeight: '600' }}>● Unsaved changes</span>}
            <Button variant="primary" disabled={!dirty || saving} onClick={save}>
              {saving ? 'Saving…' : dirty ? 'Save changes' : '✓ Saved'}
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid #e5ddd0', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: tab === t.key ? '#0d2318' : 'transparent', color: tab === t.key ? '#fdfcf8' : '#5a6661', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href={current.href} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '12px', border: '1px solid #e5ddd0', background: '#fff', color: '#0d2318', textDecoration: 'none' }}>
            View page ↗
          </a>
          <Button small onClick={resetSection}>Reset to original</Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {tab === 'home' && (
          <>
            <Section title="Hero" description="The first thing visitors see on the homepage.">
              <Field label="Small label above the headline"><Text value={home.badge} onChange={v => set('home', 'badge', v)} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <Field label="Headline"><Text value={home.headline} onChange={v => set('home', 'headline', v)} /></Field>
                <Field label="Headline — highlighted part" hint="Shown in amber after the headline."><Text value={home.headline_highlight} onChange={v => set('home', 'headline_highlight', v)} /></Field>
              </div>
              <Field label="Sub-headline"><Area value={home.subtext} onChange={v => set('home', 'subtext', v)} /></Field>
              <Field label="Small tagline under the buttons"><Text value={home.tagline} onChange={v => set('home', 'tagline', v)} /></Field>
            </Section>
            <Section title="The project" description="The dark section below the stats strip.">
              <Field label="Heading"><Area rows={2} value={home.mission_title} onChange={v => set('home', 'mission_title', v)} /></Field>
              <Field label="Paragraph"><Area rows={4} value={home.mission_text} onChange={v => set('home', 'mission_text', v)} /></Field>
            </Section>
          </>
        )}

        {tab === 'about' && (
          <>
            <Section title="Photo"><PhotoField value={about.photo_url} onChange={v => set('about', 'photo_url', v)} /></Section>
            <Section title="Introduction" description="The top of the About page.">
              <Field label="Role / title"><Text value={about.role} onChange={v => set('about', 'role', v)} /></Field>
              <Field label="Intro paragraph"><Area rows={4} value={about.intro} onChange={v => set('about', 'intro', v)} /></Field>
            </Section>
            <Section title="Background" description="The section next to the photo.">
              <Field label="Heading"><Text value={about.bio_heading} onChange={v => set('about', 'bio_heading', v)} /></Field>
              <Field label="Paragraphs">
                <ListEditor
                  items={about.bio.map(text => ({ text }))}
                  onChange={items => set('about', 'bio', items.map(i => i.text))}
                  fields={[{ key: 'text', label: 'Paragraph', multiline: true, rows: 4 }]}
                  addLabel="Add paragraph"
                  emptyText="No paragraphs yet."
                  newItem={() => ({ text: '' })}
                />
              </Field>
              <Field label="Quick facts" hint="The small cards under the paragraphs.">
                <ListEditor
                  items={about.facts}
                  onChange={v => set('about', 'facts', v)}
                  fields={[{ key: 'label', label: 'Label', placeholder: 'Focus' }, { key: 'value', label: 'Value', placeholder: 'Energy Policy' }]}
                  addLabel="Add fact"
                  emptyText="No facts — the cards are hidden."
                  newItem={() => ({ label: '', value: '' })}
                />
              </Field>
            </Section>
            <Section title="Research milestones" description="The timeline. Use the arrows to reorder.">
              <ListEditor
                items={about.milestones}
                onChange={v => set('about', 'milestones', v)}
                fields={[
                  { key: 'tag', label: 'Date or tag', placeholder: 'June 2026' },
                  { key: 'title', label: 'Title', placeholder: 'What happened' },
                  { key: 'desc', label: 'Description', multiline: true, wide: true },
                ]}
                addLabel="Add milestone"
                emptyText="No milestones — the timeline is hidden."
                newItem={() => ({ tag: '', title: '', desc: '' })}
              />
            </Section>
            <Section title="Achievements & awards" description="The section only appears on the site once at least one achievement is added.">
              <ListEditor
                items={about.achievements}
                onChange={v => set('about', 'achievements', v)}
                fields={[
                  { key: 'title', label: 'Award or achievement', placeholder: 'Winner, …' },
                  { key: 'org', label: 'Organisation / year', placeholder: 'HUEA · 2025' },
                  { key: 'desc', label: 'Details (optional)', multiline: true, wide: true },
                ]}
                addLabel="Add achievement"
                emptyText="No achievements yet — the section is hidden on the site."
                newItem={() => ({ title: '', org: '', desc: '' })}
              />
            </Section>
          </>
        )}

        {tab === 'research' && (
          <Section title="Research page" description="The page stays in “research in progress” mode until findings are published.">
            <Field label="Target number of households" hint="Shown in the page header and methodology.">
              <Text type="number" value={research.target_households} onChange={v => set('research', 'target_households', v)} />
            </Field>
            <Field label="Status banner text" hint="The amber banner under the page header.">
              <Area value={research.status_text} onChange={v => set('research', 'status_text', v)} />
            </Field>
          </Section>
        )}

        {tab === 'contact' && (
          <>
            <Section title="Contact details" description="Shown on the Contact page and in the footer. Leave a field blank to hide it.">
              <Field label="Contact page intro"><Area value={contact.intro} onChange={v => set('contact', 'intro', v)} /></Field>
              <Field label="Email"><Text type="email" value={contact.email} onChange={v => set('contact', 'email', v)} placeholder="name@example.com" /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <Field label="LinkedIn" hint="Profile URL or username"><Text value={contact.linkedin} onChange={v => set('contact', 'linkedin', v)} placeholder="linkedin.com/in/…" /></Field>
                <Field label="X / Twitter" hint="Profile URL or @handle"><Text value={contact.twitter} onChange={v => set('contact', 'twitter', v)} placeholder="@handle" /></Field>
                <Field label="Instagram" hint="Profile URL or @handle"><Text value={contact.instagram} onChange={v => set('contact', 'instagram', v)} placeholder="@handle" /></Field>
              </div>
            </Section>
            <Section title="Footer">
              <Field label="Short description"><Area rows={2} value={content.footer.blurb} onChange={v => set('footer', 'blurb', v)} /></Field>
            </Section>
          </>
        )}
      </div>

      {dirty && (
        <div style={{ position: 'sticky', bottom: '20px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px 10px 18px', borderRadius: '999px', background: '#0d2318', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '13px', color: '#fcd34d' }}>You have unsaved changes</span>
            <Button small onClick={() => setContent(savedContent)}>Discard</Button>
            <Button small variant="primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
