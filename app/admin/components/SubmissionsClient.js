'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function SubmissionsClient({ energy, feedback }) {
  const [tab, setTab] = useState('feedback');
  const [feedbackList, setFeedbackList] = useState(feedback);

  const markRead = async (id) => {
    const supabase = createClient();
    await supabase.from('feedback_submissions').update({ is_read: true }).eq('id', id);
    setFeedbackList(prev => prev.map(f => f.id === id ? { ...f, is_read: true } : f));
  };

  const formatDate = (str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const unreadCount = feedbackList.filter(f => !f.is_read).length;

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#0d2318', margin: 0 }}>Submissions</h1>
        <p style={{ fontSize: '14px', color: '#8a948f', marginTop: '6px' }}>
          {energy.length} survey responses · {feedbackList.length} messages {unreadCount > 0 ? `· ${unreadCount} unread` : ''}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid #e5ddd0', width: 'fit-content' }}>
        {[
          { key: 'feedback', label: `Messages (${feedbackList.length})` },
          { key: 'energy',   label: `Survey responses (${energy.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: tab === t.key ? '#0d2318' : 'transparent', color: tab === t.key ? '#fdfcf8' : '#5a6661', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {t.label}
            {t.key === 'feedback' && unreadCount > 0 && (
              <span style={{ marginLeft: '6px', background: '#dc2626', color: '#fff', borderRadius: '999px', padding: '1px 6px', fontSize: '10px', fontWeight: '700' }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback tab */}
      {tab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {feedbackList.length === 0 ? (
            <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: '#c8b89a' }}>No messages yet</p>
            </div>
          ) : feedbackList.map((f) => (
            <div key={f.id} style={{ padding: '20px 24px', borderRadius: '14px', background: '#fff', border: `1px solid ${!f.is_read ? '#fde68a' : '#e5ddd0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {!f.is_read && <span style={{ fontSize: '10px', fontWeight: '700', background: '#fef9ec', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '999px' }}>NEW</span>}
                  <span style={{ fontSize: '11px', fontWeight: '600', background: '#f5f0e8', color: '#5a6661', padding: '2px 10px', borderRadius: '999px', textTransform: 'capitalize' }}>{f.subject_type}</span>
                  <span style={{ fontSize: '12px', color: '#8a948f' }}>{formatDate(f.submitted_at)}</span>
                </div>
                {!f.is_read && (
                  <button onClick={() => markRead(f.id)} style={{ fontSize: '12px', color: '#356452', background: '#f0f7f4', border: '1px solid #bbd7c8', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    Mark as read
                  </button>
                )}
              </div>
              {(f.name || f.email) && (
                <p style={{ fontSize: '13px', color: '#5a6661', marginBottom: '8px' }}>
                  {f.name && <strong>{f.name}</strong>}{f.name && f.email && ' · '}{f.email && <a href={`mailto:${f.email}`} style={{ color: '#356452' }}>{f.email}</a>}
                </p>
              )}
              <p style={{ fontSize: '14px', color: '#0d2318', lineHeight: 1.7, margin: 0 }}>{f.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Energy tab */}
      {tab === 'energy' && (
        <div>
          {energy.length === 0 ? (
            <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '2px dashed #e5ddd0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: '#c8b89a' }}>No survey responses yet</p>
            </div>
          ) : (
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e5ddd0' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#f5f0e8', borderBottom: '1px solid #e5ddd0' }}>
                      {['Date', 'Location', 'Home type', 'kWh/mo', 'Bill (₹)', 'Source', 'Solar', 'ACs'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#5a6661', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {energy.map((e, i) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid #f0ebe0', background: i % 2 === 0 ? '#fff' : '#fdfcf8' }}>
                        <td style={{ padding: '12px 16px', color: '#5a6661', whiteSpace: 'nowrap' }}>{formatDate(e.submitted_at)}</td>
                        <td style={{ padding: '12px 16px', color: '#0d2318' }}>{[e.city, e.state].filter(Boolean).join(', ') || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#0d2318', textTransform: 'capitalize' }}>{e.home_type?.replace('_', ' ') || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#0d2318', fontWeight: '600' }}>{e.monthly_electricity_kwh ?? '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#0d2318', fontWeight: '600' }}>{e.monthly_electricity_bill ? `₹${e.monthly_electricity_bill.toLocaleString()}` : '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#0d2318', textTransform: 'capitalize' }}>{e.primary_energy_source || '—'}</td>
                        <td style={{ padding: '12px 16px' }}><span style={{ color: e.has_solar ? '#356452' : '#8a948f' }}>{e.has_solar ? '✓' : '✗'}</span></td>
                        <td style={{ padding: '12px 16px', color: '#0d2318' }}>{e.ac_count ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
