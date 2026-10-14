'use client';

// Shared building blocks for admin screens.

export const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5ddd0', fontSize: '14px', color: '#0d2318', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
export const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#5a6661', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
export const cardStyle = { padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' };
export const hintStyle = { fontSize: '12px', color: '#8a948f', marginTop: '6px' };

const BUTTONS = {
  primary:   { background: '#f59e0b', color: '#060f0b', border: '1px solid #f59e0b', fontWeight: '700' },
  dark:      { background: '#0d2318', color: '#fdfcf8', border: '1px solid #0d2318', fontWeight: '600' },
  secondary: { background: '#fff', color: '#0d2318', border: '1px solid #e5ddd0', fontWeight: '500' },
  danger:    { background: '#fff', color: '#dc2626', border: '1px solid #fecaca', fontWeight: '500' },
};

export function Button({ variant = 'secondary', small, style, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      style={{
        padding: small ? '6px 12px' : '9px 18px',
        borderRadius: '999px',
        fontSize: small ? '12px' : '13px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.55 : 1,
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        ...BUTTONS[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
      <div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px', marginBottom: 0 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, text }) {
  return (
    <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
      <p style={{ fontSize: '16px', color: '#8a948f', margin: 0 }}>{title}</p>
      {text && <p style={{ fontSize: '13px', color: '#b0a898', marginTop: '6px', marginBottom: 0 }}>{text}</p>}
    </div>
  );
}

// Calls an /api/admin route and throws a readable error on failure.
export async function adminFetch(url, { method = 'GET', body, formData } = {}) {
  const res = await fetch(url, {
    method,
    headers: formData ? undefined : { 'Content-Type': 'application/json' },
    body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Your session has expired — please sign in again.');
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export function formatDate(str) {
  return str ? new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}
