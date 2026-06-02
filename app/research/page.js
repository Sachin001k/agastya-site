import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 60; // revalidate every 60 seconds

async function getLiveStats() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('energy_submissions')
      .select('monthly_electricity_kwh, monthly_electricity_bill, primary_energy_source, home_type, state, has_solar, consent_aggregate_display')
      .eq('consent_research_use', true);

    if (error || !data || data.length === 0) {
      return { total: 0, avgKwh: null, avgBill: null, solarPct: null, topHomeType: null, stateBreakdown: {}, sourceBreakdown: {}, billPct: null, billTotal: 0 };
    }

    const total = data.length;

    // Average kWh
    const kwhData = data.filter(d => d.monthly_electricity_kwh);
    const avgKwh = kwhData.length > 0
      ? Math.round(kwhData.reduce((s, d) => s + d.monthly_electricity_kwh, 0) / kwhData.length)
      : null;

    // Average bill
    const billData = data.filter(d => d.monthly_electricity_bill);
    const avgBill = billData.length > 0
      ? Math.round(billData.reduce((s, d) => s + d.monthly_electricity_bill, 0) / billData.length)
      : null;

    // Solar adoption
    const solarCount = data.filter(d => d.has_solar || d.primary_energy_source === 'solar' || d.primary_energy_source === 'mixed').length;
    const solarPct = Math.round((solarCount / total) * 100);

    // Top home type
    const homeTypeCounts = {};
    data.forEach(d => { if (d.home_type) homeTypeCounts[d.home_type] = (homeTypeCounts[d.home_type] || 0) + 1; });
    const topHomeType = Object.keys(homeTypeCounts).sort((a, b) => homeTypeCounts[b] - homeTypeCounts[a])[0];
    const topHomeTypeLabel = { apartment: 'Apartment', independent_house: 'Independent house', villa: 'Villa', other: 'Other' }[topHomeType] || '—';

    // State breakdown
    const stateBreakdown = {};
    data.forEach(d => { if (d.state) stateBreakdown[d.state] = (stateBreakdown[d.state] || 0) + 1; });

    // Energy source breakdown
    const sourceBreakdown = { grid: 0, solar: 0, mixed: 0, generator: 0 };
    data.forEach(d => { if (d.primary_energy_source) sourceBreakdown[d.primary_energy_source] = (sourceBreakdown[d.primary_energy_source] || 0) + 1; });
    const sourceTotal = Object.values(sourceBreakdown).reduce((s, v) => s + v, 0);
    const sourcePct = sourceTotal > 0
      ? Object.fromEntries(Object.entries(sourceBreakdown).map(([k, v]) => [k, Math.round((v / sourceTotal) * 100)]))
      : { grid: 72, solar: 14, mixed: 10, generator: 4 }; // fallback placeholders

    // Bill distribution buckets
    const billBuckets = { u500: 0, u1000: 0, u2000: 0, u4000: 0, above4000: 0 };
    const billRows = data.filter(d => d.monthly_electricity_bill);
    billRows.forEach(d => {
      const b = d.monthly_electricity_bill;
      if (b < 500) billBuckets.u500++;
      else if (b < 1000) billBuckets.u1000++;
      else if (b < 2000) billBuckets.u2000++;
      else if (b < 4000) billBuckets.u4000++;
      else billBuckets.above4000++;
    });
    const billTotal = billRows.length;
    const billPct = billTotal > 0 ? {
      u500:      Math.round((billBuckets.u500      / billTotal) * 100),
      u1000:     Math.round((billBuckets.u1000     / billTotal) * 100),
      u2000:     Math.round((billBuckets.u2000     / billTotal) * 100),
      u4000:     Math.round((billBuckets.u4000     / billTotal) * 100),
      above4000: Math.round((billBuckets.above4000 / billTotal) * 100),
    } : null;

    return { total, avgKwh, avgBill, solarPct, topHomeTypeLabel, stateBreakdown, sourcePct, billPct, billTotal };
  } catch {
    return { total: 0, avgKwh: null, avgBill: null, solarPct: null, topHomeTypeLabel: null, stateBreakdown: {}, sourcePct: { grid: 72, solar: 14, mixed: 10, generator: 4 }, billPct: null, billTotal: 0 };
  }
}

export default async function ResearchPage() {
  const live = await getLiveStats();
  const hasData = live.total > 0;

  const findings = [
    { icon: '⚡', title: 'Average monthly consumption', value: hasData && live.avgKwh ? `${live.avgKwh} kWh` : '— kWh', desc: hasData ? `Based on ${live.total} surveyed households.` : 'Across all surveyed households. Will update as responses come in.' },
    { icon: '☀️', title: 'Solar adoption rate',         value: hasData ? `${live.solarPct}%` : '— %',                  desc: hasData ? `${live.solarPct}% of respondents use solar or mixed energy.` : 'Households that have switched to solar or mixed energy sources.' },
    { icon: '💰', title: 'Average monthly bill',        value: hasData && live.avgBill ? `₹${live.avgBill.toLocaleString()}` : '₹ —', desc: hasData ? `Average across ${live.total} households.` : 'Average household electricity expenditure per month.' },
    { icon: '🏠', title: 'Most common home type',       value: hasData && live.topHomeTypeLabel ? live.topHomeTypeLabel : '—', desc: hasData ? 'Most frequently reported dwelling type.' : 'Most frequently reported dwelling type among respondents.' },
  ];

  const sp = live.sourcePct || {};
  const barData = [
    { label: 'Grid only', pct: hasData ? (sp.grid    || 0) : 72, color: '#356452' },
    { label: 'Solar',     pct: hasData ? (sp.solar   || 0) : 14, color: '#f59e0b' },
    { label: 'Mixed',     pct: hasData ? (sp.mixed   || 0) : 10, color: '#477e67' },
    { label: 'Generator', pct: hasData ? (sp.generator || 0) : 4, color: '#8a948f' },
  ];

  // Solar impact calculations based on live data
  const avgKwhForCalc = live.avgKwh || 250;
  const avgBillForCalc = live.avgBill || (avgKwhForCalc * 8);
  const solarImpact = {
    co2Avoided:  hasData ? `${Math.round(live.total * avgKwhForCalc * 0.80 * 0.012 * 12)} tonnes` : '— tonnes',
    cleanEnergy: hasData ? `${Math.round(live.total * avgKwhForCalc * 0.80).toLocaleString()} kWh/mo` : '— kWh',
    savings:     hasData ? `₹${Math.round(live.total * avgBillForCalc * 0.50 * 12).toLocaleString()}` : '₹ —',
    coalOffset:  hasData ? `${(live.total * avgKwhForCalc * 0.80 * 12 / 1000000).toFixed(3)}` : '—',
  };

  const applianceData = [
    { label: 'Air Conditioner',  pct: 45, kwh: '~120 kWh/month', color: '#f59e0b' },
    { label: 'Water Heater',     pct: 18, kwh: '~48 kWh/month',  color: '#d97706' },
    { label: 'Refrigerator',     pct: 12, kwh: '~32 kWh/month',  color: '#356452' },
    { label: 'Washing Machine',  pct: 8,  kwh: '~21 kWh/month',  color: '#477e67' },
    { label: 'Lighting',         pct: 7,  kwh: '~19 kWh/month',  color: '#7aaa8e' },
    { label: 'TV & Electronics', pct: 6,  kwh: '~16 kWh/month',  color: '#8a948f' },
    { label: 'Others',           pct: 4,  kwh: '~11 kWh/month',  color: '#b0a898' },
  ];

  // Bill distribution — calculated from live data
  const billBuckets = [
    { range: 'Under ₹500',     min: 0,    max: 500,  color: '#7aaa8e' },
    { range: '₹500 – ₹1,000',  min: 500,  max: 1000, color: '#477e67' },
    { range: '₹1,000 – ₹2,000',min: 1000, max: 2000, color: '#356452' },
    { range: '₹2,000 – ₹4,000',min: 2000, max: 4000, color: '#f59e0b' },
    { range: 'Above ₹4,000',   min: 4000, max: Infinity, color: '#d97706' },
  ];
  const billDistribution = billBuckets.map(b => ({ ...b, pct: 0, count: 0 })); // will be filled below
  // Note: actual bill counts come from live.billBuckets set in getLiveStats

  const topStates = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Others'];
  const stateData = topStates.map(state => ({
    state,
    count: state === 'Others'
      ? Object.entries(live.stateBreakdown).filter(([s]) => !topStates.slice(0, 5).includes(s)).reduce((sum, [, v]) => sum + v, 0).toString() || '—'
      : (live.stateBreakdown[state] || '—').toString(),
  }));

  return (
    <>
      <ScrollReveal />
      <style>{`
        @media (max-width: 768px) {
          .research-hero-grid { grid-template-columns: 1fr !important; }
          .research-hero-stats { justify-content: flex-start !important; flex-wrap: wrap !important; gap: 16px !important; }
          .research-two-col { grid-template-columns: 1fr !important; }
          .research-four-col { grid-template-columns: repeat(2,1fr) !important; }
          .research-three-col { grid-template-columns: 1fr !important; }
          .research-six-col { grid-template-columns: repeat(3,1fr) !important; }
          .research-carbon-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '72px 20px 64px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>RESEARCH</span>
          </div>
          <div className="research-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-1px' }}>
                Findings &amp; <span style={{ color: '#f59e0b' }}>data</span>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', maxWidth: '440px' }}>
                Primary survey data on household energy consumption across India — with analysis and green-energy recommendations.
              </p>
            </div>
            <div className="research-hero-stats" style={{ display: 'flex', gap: '24px', justifyContent: 'flex-end' }}>
              {[
                { label: 'Households surveyed', value: live.total > 0 ? live.total.toString() : '—' },
                { label: 'States covered',       value: live.total > 0 ? Object.keys(live.stateBreakdown).length.toString() : '—' },
                { label: 'Data points',          value: live.total > 0 ? (live.total * 12).toString() : '—' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px', maxWidth: '80px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '36px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: '#fcd34d', margin: 0 }}>
              Survey is live — findings will update as responses come in.{' '}
              <Link href="/energy-survey" style={{ color: '#f59e0b', fontWeight: '600', textDecoration: 'underline' }}>Take the survey →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── KEY FINDINGS ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Key findings</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '36px' }}>What the data shows</h2>
          <div className='findings-grid research-four-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {findings.map((f, i) => (
              <div key={f.title} className={`reveal reveal-${i + 1} hover-card`} style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{f.icon}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>{f.value}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>{f.title}</p>
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#8a948f' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENERGY SOURCE CHART ── */}
      <section style={{ background: '#fff', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div className="reveal reveal-1">
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Energy sources</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', lineHeight: 1.3, marginBottom: '16px' }}>
              How do households power their homes?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661', marginBottom: '16px' }}>
              The vast majority of surveyed households rely solely on the grid. Solar and mixed-source adoption remains limited — a core finding of this research.
            </p>
            <p style={{ fontSize: '13px', color: '#8a948f', fontStyle: 'italic' }}>{hasData ? `* Based on ${live.total} survey responses.` : '* Placeholder data — updates as survey responses come in.'}</p>
          </div>
          <div className="reveal reveal-2" style={{ padding: '28px', borderRadius: '16px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>Primary energy source — % of households</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {barData.map((b) => (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#5a6661', fontWeight: '500' }}>{b.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318' }}>{b.pct}%*</span>
                  </div>
                  <div style={{ height: '10px', background: '#e5ddd0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: '5px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP APPLIANCES ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div className="reveal reveal-1" style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>Share of monthly electricity bill by appliance</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {applianceData.map((a) => (
                <div key={a.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#5a6661', fontWeight: '500' }}>{a.label}</span>
                    <span style={{ fontSize: '12px', color: '#8a948f' }}>{a.kwh}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e5ddd0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${a.pct}%`, height: '100%', background: a.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '16px', fontStyle: 'italic' }}>* Based on average Indian household usage. Placeholder data.</p>
          </div>
          <div className="reveal reveal-2">
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Appliance impact</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', lineHeight: 1.3, marginBottom: '16px' }}>
              What&apos;s really driving your electricity bill?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661', marginBottom: '16px' }}>
              Air conditioners alone account for nearly half of household electricity consumption in India. Understanding this breakdown is the first step toward meaningful energy savings.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661' }}>
              Switching just the AC to an inverter model with a 5-star BEE rating can reduce overall household consumption by up to 25%.
            </p>
          </div>
        </div>
      </section>


      {/* ── BILL DISTRIBUTION ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div className="reveal reveal-1">
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Economic inequality</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', lineHeight: 1.3, marginBottom: '16px' }}>
              How much are households really paying?
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661', marginBottom: '16px' }}>
              Electricity bills in India are far from uniform. While some households spend under ₹500 a month, others face bills exceeding ₹4,000 — a 8x difference that reflects deep inequalities in housing, income, and access to efficient appliances.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661' }}>
              This distribution has direct implications for how subsidy policy should be designed — a flat subsidy benefits high-consumption households more than low-income ones.
            </p>
          </div>
          <div className="reveal reveal-2" style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>Monthly electricity bill — % of households</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { range: 'Under ₹500',      pct: live.billPct ? live.billPct.u500      : null, color: '#7aaa8e' },
                { range: '₹500 – ₹1,000',  pct: live.billPct ? live.billPct.u1000     : null, color: '#477e67' },
                { range: '₹1,000 – ₹2,000',pct: live.billPct ? live.billPct.u2000     : null, color: '#356452' },
                { range: '₹2,000 – ₹4,000',pct: live.billPct ? live.billPct.u4000     : null, color: '#f59e0b' },
                { range: 'Above ₹4,000',   pct: live.billPct ? live.billPct.above4000  : null, color: '#d97706' },
              ].map((b) => (
                <div key={b.range}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px', color: '#5a6661', fontWeight: '500' }}>{b.range}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318' }}>
                      {b.pct !== null ? `${b.pct}%` : '—'}
                    </span>
                  </div>
                  <div style={{ height: '10px', background: '#e5ddd0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: b.pct !== null ? `${b.pct * 2}%` : '0%', height: '100%', background: b.color, borderRadius: '5px' }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '16px', fontStyle: 'italic' }}>
              {live.billPct ? `* Based on ${live.billTotal} survey responses.` : '* Updates as survey responses come in.'}
            </p>
          </div>
        </div>
      </section>


      {/* ── SOLAR IMPACT CALCULATOR ── */}
      <section style={{ background: '#060f0b', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Impact projection</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '8px' }}>
            What if every surveyed household switched to solar?
          </h2>
          <p className="reveal reveal-3" style={{ fontSize: '16px', color: '#7aaa8e', marginBottom: '40px', maxWidth: '600px' }}>
            Based on average consumption data, here is the projected collective impact if all survey respondents adopted rooftop solar.
          </p>
          <div className='findings-grid research-four-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { icon: '🌍', value: solarImpact.co2Avoided,  label: 'CO₂ avoided per year',        desc: 'Equivalent to planting thousands of trees annually' },
              { icon: '💡', value: solarImpact.cleanEnergy, label: 'Clean energy generated',      desc: 'Total renewable energy produced per month' },
              { icon: '💰', value: solarImpact.savings,     label: 'Collective savings per year',  desc: 'Money saved by households switching to solar' },
              { icon: '🏭', value: solarImpact.coalOffset,  label: 'Coal plants offset (MW)',      desc: 'Equivalent coal power generation displaced' },
            ].map((s, i) => (
              <div key={s.label} className={`reveal reveal-${i + 1} hover-card`} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>{s.icon}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#f59e0b', marginBottom: '6px' }}>{s.value}</p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#fdfcf8', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#7aaa8e' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGIONAL BREAKDOWN ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Regional coverage</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '36px' }}>
            States covered by the survey
          </h2>
          <div className='states-grid research-six-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {stateData.map((s, i) => (
              <div key={s.state} className={`reveal reveal-${Math.min(i + 1, 4)} hover-card`} style={{ padding: '20px 16px', borderRadius: '12px', background: '#fff', border: '1px solid #e5ddd0', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: '#f59e0b', margin: '0 0 4px' }}>{s.count}</p>
                <p style={{ fontSize: '12px', color: '#5a6661', fontWeight: '500' }}>{s.state}</p>
                <p style={{ fontSize: '11px', color: '#8a948f', marginTop: '2px' }}>responses</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOMMENDATIONS ── */}
      <section style={{ background: '#0d2318', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Recommendations</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '36px' }}>
            Switching to green energy
          </h2>
          <div className='cards-grid research-three-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { num: '01', title: 'Rooftop solar installation',    desc: 'For households in high-sunlight regions, rooftop solar panels can reduce electricity bills by 40–60%. Government subsidies under PM-KUSUM make this increasingly accessible.' },
              { num: '02', title: 'Energy-efficient appliances',    desc: 'Switching to BEE 5-star rated appliances — especially ACs — can reduce household energy consumption by 20–30% with no lifestyle change required.' },
              { num: '03', title: 'Time-of-use electricity plans',  desc: 'Some state DISCOMs now offer time-of-use tariffs. Shifting high-consumption activities to off-peak hours can meaningfully reduce monthly bills.' },
            ].map((r, i) => (
              <div key={r.num} className={`reveal reveal-${i + 1} hover-card`} style={{ padding: '28px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: 'rgba(245,158,11,0.3)', marginBottom: '16px', lineHeight: 1 }}>{r.num}</p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '600', color: '#fdfcf8', marginBottom: '12px' }}>{r.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#7aaa8e' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ── */}
      <section style={{ background: '#fff', padding: '64px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Methodology</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
            How this research was conducted
          </h2>
          <div className="reveal reveal-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Survey method',      value: 'Self-reported online survey' },
              { label: 'Sample size',        value: 'Ongoing — target 500+ households' },
              { label: 'Geographic scope',   value: 'Urban and rural India, multiple states' },
              { label: 'Data collection',    value: '2025 – present' },
              { label: 'Anonymisation',      value: 'All responses anonymised before analysis' },
              { label: 'Consent',            value: 'Explicit research consent obtained from all participants' },
            ].map((m) => (
              <div key={m.label} style={{ padding: '16px 20px', borderRadius: '10px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
                <p style={{ fontSize: '11px', color: '#8a948f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{m.label}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#0d2318' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="reveal reveal-4" style={{ padding: '20px 24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#356452', marginBottom: '8px' }}>Limitations</p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#5a6661' }}>
              This is a self-reported survey with a non-random sample. Results reflect respondents who chose to participate and may not be fully representative of the Indian population. The research is designed to be exploratory — identifying patterns and generating hypotheses rather than establishing definitive causal relationships.
            </p>
          </div>
        </div>
      </section>

      {/* ── CARBON FOOTPRINT ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Carbon footprint</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>
            The climate cost of household electricity
          </h2>
          <p className="reveal reveal-3" style={{ fontSize: '15px', color: '#5a6661', marginBottom: '40px', maxWidth: '600px' }}>
            India&apos;s electricity grid has one of the highest carbon emission factors in the world — 0.82 kg CO₂ per kWh. Every unit of grid electricity consumed contributes directly to greenhouse gas emissions.
          </p>

          {/* Grid emission factor comparison */}
          <div className="reveal reveal-1 research-carbon-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {[
              { country: 'India',         factor: '0.82', unit: 'kg CO₂/kWh', color: '#d97706', highlight: true },
              { country: 'China',         factor: '0.58', unit: 'kg CO₂/kWh', color: '#477e67', highlight: false },
              { country: 'EU Average',    factor: '0.23', unit: 'kg CO₂/kWh', color: '#356452', highlight: false },
              { country: 'Solar (India)', factor: '0.02', unit: 'kg CO₂/kWh', color: '#7aaa8e', highlight: false },
            ].map((c) => (
              <div
                key={c.country}
                className="hover-card"
                style={{ padding: '24px', borderRadius: '16px', background: c.highlight ? '#0d2318' : '#fff', border: `1px solid ${c.highlight ? '#1a4a2a' : '#e5ddd0'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}
              >
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: '700', color: c.color, margin: '0 0 4px' }}>{c.factor}</p>
                <p style={{ fontSize: '11px', color: c.highlight ? '#7aaa8e' : '#8a948f', marginBottom: '8px' }}>{c.unit}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: c.highlight ? '#fdfcf8' : '#0d2318' }}>{c.country}</p>
              </div>
            ))}
          </div>

          {/* What average consumption means in CO2 */}
          <div className='two-col-grid research-two-col' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="reveal reveal-2" style={{ padding: '28px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '20px' }}>
                Average Indian household — monthly carbon footprint from electricity
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Monthly consumption',      value: '~250 kWh',    sub: 'national average' },
                  { label: 'CO₂ emitted per month',    value: '~205 kg',     sub: '0.82 kg × 250 kWh' },
                  { label: 'CO₂ emitted per year',     value: '~2.46 tonnes', sub: 'from electricity alone' },
                  { label: 'Trees needed to offset',   value: '~11 trees',   sub: 'per household per year' },
                ].map((r) => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0ebe0' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#5a6661', margin: 0 }}>{r.label}</p>
                      <p style={{ fontSize: '11px', color: '#8a948f', margin: 0 }}>{r.sub}</p>
                    </div>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>{r.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal reveal-3" style={{ padding: '28px', borderRadius: '16px', background: '#0d2318', border: '1px solid #1a4a2a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#7aaa8e', marginBottom: '16px' }}>
                  If the same household switched to rooftop solar:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'CO₂ per month',   value: '~4 kg',      sub: '98% reduction' },
                    { label: 'CO₂ per year',    value: '~50 kg',     sub: 'vs 2.46 tonnes on grid' },
                    { label: 'Annual saving',   value: '2.41 tonnes', sub: 'CO₂ avoided per household' },
                    { label: 'Bill reduction',  value: '40–60%',     sub: 'depending on system size' },
                  ].map((r) => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <p style={{ fontSize: '13px', color: 'rgba(253,252,248,0.65)', margin: 0 }}>{r.label}</p>
                        <p style={{ fontSize: '11px', color: '#477e67', margin: 0 }}>{r.sub}</p>
                      </div>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>{r.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                href="/energy-survey"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '13px', fontWeight: '700', textDecoration: 'none', marginTop: '24px', alignSelf: 'flex-start' }}
              >
                Calculate your footprint →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SURVEY CTA ── */}
      <section style={{ background: '#0d2318', padding: '80px 20px', borderTop: '1px solid #1a4a2a' }}>
        <div className="reveal reveal-1" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Add your household to the dataset
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            The more data we collect, the more accurate the findings. Take the 2-minute survey and get your own personalised energy report.
          </p>
          <Link
            href="/energy-survey"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}
          >
            Check Your Energy Use →
          </Link>
        </div>
      </section>
    </>
  );
}