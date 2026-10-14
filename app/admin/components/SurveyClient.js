'use client';

import { Fragment, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, PageHeader, EmptyState, adminFetch, formatDate, inputStyle } from './ui';

const COLUMNS = [
  { key: 'submitted_at', label: 'Date', render: r => formatDate(r.submitted_at) },
  { key: 'location', label: 'Location', render: r => [r.city, r.state].filter(Boolean).join(', ') || '—' },
  { key: 'home_type', label: 'Home', render: r => r.home_type?.replace(/_/g, ' ') || '—' },
  { key: 'household_size', label: 'People', render: r => r.household_size ?? '—' },
  { key: 'monthly_electricity_kwh', label: 'kWh/mo', render: r => r.monthly_electricity_kwh ?? '—' },
  { key: 'monthly_electricity_bill', label: 'Bill', render: r => r.monthly_electricity_bill ? `₹${Number(r.monthly_electricity_bill).toLocaleString('en-IN')}` : '—' },
  { key: 'primary_energy_source', label: 'Source', render: r => r.primary_energy_source || '—' },
  { key: 'has_solar', label: 'Solar', render: r => r.has_solar ? '✓' : '—' },
];

// Every column, for the details panel and CSV export
const ALL_FIELDS = [
  'submitted_at', 'city', 'state', 'country', 'home_type', 'home_size_sqft', 'household_size',
  'monthly_electricity_kwh', 'monthly_electricity_bill', 'primary_energy_source', 'has_solar',
  'ac_count', 'ev_owner', 'appliances_count', 'email', 'consent_research_use', 'consent_aggregate_display',
];

function toCsv(rows) {
  const esc = v => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [ALL_FIELDS.join(','), ...rows.map(r => ALL_FIELDS.map(f => esc(r[f])).join(','))].join('\n');
}

export default function SurveyClient({ initialResponses }) {
  const [responses, setResponses] = useState(initialResponses);
  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return responses;
    return responses.filter(r =>
      [r.city, r.state, r.home_type, r.primary_energy_source, r.email].some(v => v && String(v).toLowerCase().includes(q)),
    );
  }, [responses, query]);

  const allVisibleSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));

  const toggle = id => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => setSelected(prev => {
    const next = new Set(prev);
    if (allVisibleSelected) filtered.forEach(r => next.delete(r.id));
    else filtered.forEach(r => next.add(r.id));
    return next;
  });

  const remove = async ids => {
    const n = ids.length;
    if (!confirm(`Delete ${n} survey response${n === 1 ? '' : 's'}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const { deleted } = await adminFetch('/api/admin/survey', { method: 'DELETE', body: { ids } });
      setResponses(prev => prev.filter(r => !ids.includes(r.id)));
      setSelected(prev => { const next = new Set(prev); ids.forEach(id => next.delete(id)); return next; });
      toast.success(`Deleted ${deleted} response${deleted === 1 ? '' : 's'}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    const rows = selected.size > 0 ? responses.filter(r => selected.has(r.id)) : filtered;
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const th = { padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#5a6661', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' };
  const td = { padding: '12px 14px', color: '#0d2318', textTransform: 'capitalize', whiteSpace: 'nowrap' };

  return (
    <div style={{ padding: '40px' }}>
      <PageHeader
        title="Survey responses"
        subtitle={`${responses.length} response${responses.length === 1 ? '' : 's'} from the household energy survey. Delete test or junk entries to keep the research data clean.`}
        actions={
          <>
            <Button onClick={exportCsv} disabled={responses.length === 0}>
              ⤓ Export {selected.size > 0 ? `${selected.size} selected` : 'CSV'}
            </Button>
            <Button variant="danger" disabled={selected.size === 0 || busy} onClick={() => remove([...selected])}>
              🗑 Delete {selected.size > 0 ? `${selected.size} selected` : 'selected'}
            </Button>
          </>
        }
      />

      {responses.length === 0 ? (
        <EmptyState title="No survey responses yet" text="Responses appear here as soon as someone completes the survey." />
      ) : (
        <>
          <input
            type="search"
            placeholder="Search by city, state, home type, energy source or email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ ...inputStyle, maxWidth: '420px', marginBottom: '16px' }}
          />
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e5ddd0', background: '#fff' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f5f0e8', borderBottom: '1px solid #e5ddd0' }}>
                    <th style={{ ...th, width: '36px' }}>
                      <input type="checkbox" aria-label="Select all" checked={allVisibleSelected} onChange={toggleAll} />
                    </th>
                    {COLUMNS.map(c => <th key={c.key} style={th}>{c.label}</th>)}
                    <th style={th} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <Fragment key={r.id}>
                      <tr style={{ borderBottom: '1px solid #f0ebe0', background: selected.has(r.id) ? '#fef9ec' : '#fff' }}>
                        <td style={td}>
                          <input type="checkbox" aria-label="Select response" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                        </td>
                        {COLUMNS.map(c => <td key={c.key} style={td}>{c.render(r)}</td>)}
                        <td style={{ ...td, textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Button small onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                              {expanded === r.id ? 'Hide' : 'Details'}
                            </Button>
                            <Button small variant="danger" disabled={busy} onClick={() => remove([r.id])}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                      {expanded === r.id && (
                        <tr style={{ background: '#fdfcf8', borderBottom: '1px solid #f0ebe0' }}>
                          <td />
                          <td colSpan={COLUMNS.length + 1} style={{ padding: '16px 14px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px 24px' }}>
                              {ALL_FIELDS.map(f => (
                                <div key={f}>
                                  <p style={{ fontSize: '11px', color: '#8a948f', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{f.replace(/_/g, ' ')}</p>
                                  <p style={{ fontSize: '13px', color: '#0d2318', margin: '2px 0 0' }}>
                                    {r[f] === true ? 'Yes' : r[f] === false ? 'No' : r[f] ?? '—'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <p style={{ padding: '24px', textAlign: 'center', color: '#8a948f', fontSize: '13px', margin: 0 }}>No responses match “{query}”.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

