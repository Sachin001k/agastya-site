'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, PageHeader, EmptyState, adminFetch, formatDate } from './ui';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

export default function MessagesClient({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const unread = messages.filter(m => !m.is_read).length;
  const visible = messages.filter(m => filter === 'all' || (filter === 'unread' ? !m.is_read : m.is_read));

  const setRead = async (ids, is_read) => {
    setBusyId(ids.length === 1 ? ids[0] : 'all');
    try {
      await adminFetch('/api/admin/messages', { method: 'PATCH', body: { ids, is_read } });
      setMessages(prev => prev.map(m => ids.includes(m.id) ? { ...m, is_read } : m));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async m => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    setBusyId(m.id);
    try {
      await adminFetch('/api/admin/messages', { method: 'DELETE', body: { ids: [m.id] } });
      setMessages(prev => prev.filter(x => x.id !== m.id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <PageHeader
        title="Messages"
        subtitle={`Sent through the contact form · ${messages.length} total${unread ? ` · ${unread} unread` : ''}`}
        actions={unread > 0 && (
          <Button disabled={busyId === 'all'} onClick={() => setRead(messages.filter(m => !m.is_read).map(m => m.id), true)}>
            ✓ Mark all as read
          </Button>
        )}
      />

      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid #e5ddd0', width: 'fit-content' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filter === f.key ? '#0d2318' : 'transparent', color: filter === f.key ? '#fdfcf8' : '#5a6661', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            {f.label}{f.key === 'unread' && unread > 0 ? ` (${unread})` : ''}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title={messages.length === 0 ? 'No messages yet' : 'Nothing here'} text={messages.length === 0 ? 'Messages from the contact form will appear here.' : null} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visible.map(m => (
            <div key={m.id} style={{ padding: '20px 24px', borderRadius: '14px', background: '#fff', border: `1px solid ${!m.is_read ? '#fde68a' : '#e5ddd0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {!m.is_read && <span style={{ fontSize: '10px', fontWeight: '700', background: '#fef9ec', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '999px' }}>NEW</span>}
                  {m.subject_type && <span style={{ fontSize: '11px', fontWeight: '600', background: '#f5f0e8', color: '#5a6661', padding: '2px 10px', borderRadius: '999px', textTransform: 'capitalize' }}>{m.subject_type}</span>}
                  <span style={{ fontSize: '12px', color: '#8a948f' }}>{formatDate(m.submitted_at)}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {m.email && (
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`} style={{ padding: '6px 12px', borderRadius: '999px', fontSize: '12px', background: '#0d2318', color: '#fdfcf8', textDecoration: 'none', fontWeight: '600' }}>
                      ↩ Reply
                    </a>
                  )}
                  <Button small disabled={busyId === m.id} onClick={() => setRead([m.id], !m.is_read)}>
                    {m.is_read ? 'Mark unread' : 'Mark read'}
                  </Button>
                  <Button small variant="danger" disabled={busyId === m.id} onClick={() => remove(m)}>Delete</Button>
                </div>
              </div>
              {(m.name || m.email) && (
                <p style={{ fontSize: '13px', color: '#5a6661', marginBottom: '8px' }}>
                  {m.name && <strong>{m.name}</strong>}{m.name && m.email && ' · '}{m.email && <a href={`mailto:${m.email}`} style={{ color: '#356452' }}>{m.email}</a>}
                </p>
              )}
              <p style={{ fontSize: '14px', color: '#0d2318', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
