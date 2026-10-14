'use client';

import { useRef, useState } from 'react';
import { inputStyle } from './ui';

// A plain textarea with a formatting toolbar and a live preview, so essays can be
// formatted without writing HTML by hand. Stores HTML, as before.

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Turns plain text with blank lines between paragraphs into <p> blocks.
// Leaves anything that already looks like HTML alone.
export function textToHtml(text) {
  if (/<\/?(p|h[1-6]|ul|ol|li|blockquote|div)\b/i.test(text)) return text;
  return text
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('\n\n');
}

export default function HtmlEditor({ value, onChange, rows = 20, placeholder }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);

  // Wraps the current selection (or inserts a template) and keeps the cursor sensible
  const apply = (transform) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const { text, selectFrom, selectTo } = transform(selected);
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + (selectFrom ?? text.length), start + (selectTo ?? text.length));
    });
  };

  const wrap = (open, close, fallback) => () => apply(sel => {
    const inner = sel || fallback;
    return { text: open + inner + close, selectFrom: open.length, selectTo: open.length + inner.length };
  });

  const list = (tag) => () => apply(sel => {
    const items = (sel || 'List item').split('\n').map(l => l.trim()).filter(Boolean);
    const text = `<${tag}>\n${items.map(i => `  <li>${i}</li>`).join('\n')}\n</${tag}>`;
    return { text };
  });

  const link = () => {
    const url = prompt('Link address (https://…)');
    if (!url) return;
    apply(sel => {
      const label = sel || 'link text';
      const open = `<a href="${url.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">`;
      return { text: `${open}${label}</a>`, selectFrom: open.length, selectTo: open.length + label.length };
    });
  };

  const tools = [
    { label: 'B', title: 'Bold', style: { fontWeight: 700 }, run: wrap('<strong>', '</strong>', 'bold text') },
    { label: 'I', title: 'Italic', style: { fontStyle: 'italic' }, run: wrap('<em>', '</em>', 'italic text') },
    { label: 'H2', title: 'Section heading', run: wrap('<h2>', '</h2>', 'Section heading') },
    { label: 'H3', title: 'Sub-heading', run: wrap('<h3>', '</h3>', 'Sub-heading') },
    { label: '❝', title: 'Quote', run: wrap('<blockquote>', '</blockquote>', 'Quote') },
    { label: '• List', title: 'Bulleted list (one item per line)', run: list('ul') },
    { label: '1. List', title: 'Numbered list (one item per line)', run: list('ol') },
    { label: '🔗 Link', title: 'Link', run: link },
  ];

  const btn = { padding: '6px 10px', borderRadius: '6px', border: '1px solid #e5ddd0', background: '#fff', color: '#0d2318', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' };
  const wordCount = value.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
        {!preview && tools.map(t => (
          <button key={t.title} type="button" title={t.title} aria-label={t.title} onClick={t.run} style={{ ...btn, ...t.style }}>{t.label}</button>
        ))}
        {!preview && (
          <button
            type="button"
            title="Turn plain paragraphs (separated by blank lines) into formatted paragraphs"
            onClick={() => onChange(textToHtml(value))}
            style={btn}
          >
            ¶ Format paragraphs
          </button>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', background: '#f5f0e8', borderRadius: '8px', padding: '3px' }}>
          {[['Write', false], ['Preview', true]].map(([label, val]) => (
            <button
              key={label}
              type="button"
              onClick={() => setPreview(val)}
              style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', cursor: 'pointer', background: preview === val ? '#0d2318' : 'transparent', color: preview === val ? '#fdfcf8' : '#5a6661' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {preview ? (
        <div
          className="essay-preview"
          style={{ ...inputStyle, minHeight: `${rows * 1.7}em`, fontSize: '16px', lineHeight: 1.8, color: '#2b332e', background: '#fdfcf8', overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: value || '<p style="color:#8a948f">Nothing to preview yet.</p>' }}
        />
      ) : (
        <textarea
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: 'Georgia, serif', fontSize: '15px' }}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
      <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '6px' }}>
        {wordCount} words · Select text and use the toolbar to format it, or paste plain text and click “Format paragraphs”.
      </p>
    </div>
  );
}
