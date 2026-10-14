'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Renders PDFs with pdf.js inside an on-page popup, so the essay never opens
// in the browser's own PDF viewer or triggers a download.
const PDFJS_VERSION = '3.11.174';
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

let pdfjsPromise = null;
function loadPdfJs() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${PDFJS_BASE}/pdf.min.js`;
      script.async = true;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
        resolve(window.pdfjsLib);
      };
      script.onerror = () => { pdfjsPromise = null; reject(new Error('Could not load the PDF viewer')); };
      document.head.appendChild(script);
    });
  }
  return pdfjsPromise;
}

const ZOOM_STEPS = [0.6, 0.8, 1, 1.25, 1.5, 2];

export function PdfModal({ url, title, onClose }) {
  const scrollRef = useRef(null);
  const pagesRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [zoomIndex, setZoomIndex] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  // Load the document
  useEffect(() => {
    let cancelled = false;
    let doc = null;
    setStatus('loading');
    loadPdfJs()
      .then(lib => lib.getDocument(url).promise)
      .then(d => {
        doc = d;
        if (cancelled) { d.destroy(); return; }
        setPdf(d);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; if (doc) doc.destroy(); };
  }, [url]);

  // Render every page as a canvas, fitted to the popup width × zoom
  useEffect(() => {
    if (!pdf || !pagesRef.current || !scrollRef.current) return;
    let cancelled = false;
    const container = pagesRef.current;
    container.innerHTML = '';
    const available = Math.min(scrollRef.current.clientWidth - 32, 900);
    const dpr = window.devicePixelRatio || 1;

    (async () => {
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const scale = (available / base.width) * ZOOM_STEPS[zoomIndex];
        const viewport = page.getViewport({ scale: scale * dpr });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.dataset.page = n;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto 16px';
        canvas.style.background = '#fff';
        canvas.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
        canvas.style.borderRadius = '4px';
        container.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      }
    })().catch(() => {});

    return () => { cancelled = true; };
  }, [pdf, zoomIndex]);

  // Track which page is in view
  const handleScroll = useCallback(() => {
    const box = scrollRef.current;
    if (!box || !pagesRef.current) return;
    const mid = box.scrollTop + box.clientHeight / 3;
    let page = 1;
    for (const c of pagesRef.current.children) {
      if (c.offsetTop <= mid) page = Number(c.dataset.page);
    }
    setCurrentPage(page);
  }, []);

  // Esc to close, lock background scroll
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const btn = { width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fdfcf8', fontSize: '16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(6,15,11,0.82)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <div style={{ width: '100%', maxWidth: '980px', height: '100%', maxHeight: '94vh', background: '#0d2318', borderRadius: '16px', border: '1px solid #1a4a2a', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #1a4a2a' }}>
          <p style={{ flex: 1, minWidth: 0, margin: 0, fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '600', color: '#fdfcf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </p>
          {status === 'ready' && (
            <>
              <span style={{ fontSize: '12px', color: '#7aaa8e', flexShrink: 0 }}>{currentPage} / {pdf.numPages}</span>
              <button type="button" aria-label="Zoom out" style={btn} disabled={zoomIndex === 0} onClick={() => setZoomIndex(z => Math.max(0, z - 1))}>−</button>
              <button type="button" aria-label="Zoom in" style={btn} disabled={zoomIndex === ZOOM_STEPS.length - 1} onClick={() => setZoomIndex(z => Math.min(ZOOM_STEPS.length - 1, z + 1))}>+</button>
            </>
          )}
          <a href={url} download target="_blank" rel="noopener noreferrer" aria-label="Download PDF" title="Download PDF" style={{ ...btn, textDecoration: 'none' }}>⤓</a>
          <button type="button" aria-label="Close" onClick={onClose} style={{ ...btn, background: '#f59e0b', borderColor: '#f59e0b', color: '#060f0b', fontWeight: '700' }}>✕</button>
        </div>

        {/* Pages */}
        <div ref={scrollRef} onScroll={handleScroll} style={{ flex: 1, overflow: 'auto', padding: '16px', background: '#1b2a22' }}>
          {status === 'loading' && (
            <p style={{ textAlign: 'center', color: '#7aaa8e', fontSize: '14px', marginTop: '80px' }}>Loading essay…</p>
          )}
          {status === 'error' && (
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <p style={{ color: '#fdfcf8', fontSize: '15px', marginBottom: '12px' }}>The essay couldn&apos;t be displayed here.</p>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontWeight: '600', fontSize: '14px' }}>Open the PDF in a new tab →</a>
            </div>
          )}
          <div ref={pagesRef} />
        </div>
      </div>
    </div>
  );
}

export default function ReadPdfButton({ url, title, children, style }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        style={{ cursor: 'pointer', fontFamily: 'inherit', ...style }}
      >
        {children}
      </button>
      {open && createPortal(<PdfModal url={url} title={title} onClose={close} />, document.body)}
    </>
  );
}
