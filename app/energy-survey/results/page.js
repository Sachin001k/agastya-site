'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// India grid emission factor (kg CO2 per kWh)
const GRID_EMISSION_FACTOR = 0.82;
const SOLAR_EMISSION_FACTOR = 0.02;

function calculateResults(data) {
  const kwh = parseFloat(data.monthly_electricity_kwh) || 
              (parseFloat(data.monthly_electricity_bill) / 8) || 250; // fallback: ₹8/kWh avg
  const bill = parseFloat(data.monthly_electricity_bill) || kwh * 8;
  const acCount = parseInt(data.ac_count) || 0;
  const householdSize = parseInt(data.household_size) || 4;
  const hasSolar = data.has_solar || data.primary_energy_source === 'solar';

  const emissionFactor = hasSolar ? SOLAR_EMISSION_FACTOR : GRID_EMISSION_FACTOR;
  const monthlyCarbon = kwh * emissionFactor; // kg CO2/month
  const annualCarbon = monthlyCarbon * 12;
  const treesNeeded = Math.round(annualCarbon / 21); // avg tree absorbs ~21 kg CO2/year
  const perPersonCarbon = monthlyCarbon / householdSize;

  // National averages
  const nationalAvgKwh = 250;
  const nationalAvgBill = 2000;
  const nationalAvgCarbon = nationalAvgKwh * GRID_EMISSION_FACTOR;

  const percentVsAvgKwh = Math.round(((kwh - nationalAvgKwh) / nationalAvgKwh) * 100);
  const percentVsAvgBill = Math.round(((bill - nationalAvgBill) / nationalAvgBill) * 100);

  // Solar savings estimate
  const solarReductionFactor = 0.5; // 50% avg reduction
  const solarMonthlyBillSaving = bill * solarReductionFactor;
  const solarAnnualSaving = solarMonthlyBillSaving * 12;
  const solarAnnualCarbonSaving = (kwh * GRID_EMISSION_FACTOR - kwh * SOLAR_EMISSION_FACTOR) * 12;
  const solarPaybackYears = Math.round(80000 / solarAnnualSaving); // avg 4kW system ~₹80,000 after subsidy

  return {
    kwh, bill, acCount, householdSize, hasSolar,
    monthlyCarbon: Math.round(monthlyCarbon),
    annualCarbon: Math.round(annualCarbon * 10) / 10,
    treesNeeded,
    perPersonCarbon: Math.round(perPersonCarbon),
    percentVsAvgKwh,
    percentVsAvgBill,
    nationalAvgKwh,
    nationalAvgCarbon: Math.round(nationalAvgCarbon),
    solarMonthlyBillSaving: Math.round(solarMonthlyBillSaving),
    solarAnnualSaving: Math.round(solarAnnualSaving),
    solarAnnualCarbonSaving: Math.round(solarAnnualCarbonSaving * 10) / 10,
    solarPaybackYears,
  };
}

function getRating(percentVsAvg) {
  if (percentVsAvg <= -20) return { label: 'Excellent', color: '#356452', bg: '#f0f7f4', desc: 'Your household uses significantly less energy than average.' };
  if (percentVsAvg <= 0)   return { label: 'Good',      color: '#477e67', bg: '#f0f7f4', desc: 'Your household uses less energy than the national average.' };
  if (percentVsAvg <= 20)  return { label: 'Average',   color: '#d97706', bg: '#fef9ec', desc: 'Your consumption is close to the national average.' };
  return                          { label: 'High',       color: '#dc2626', bg: '#fef2f2', desc: 'Your household uses more energy than average. There is good potential to reduce.' };
}

export default function SurveyResultsPage() {
  const [results, setResults] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('survey_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      setResults(calculateResults(parsed));
    }
  }, []);

  if (!results) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#0d2318', marginBottom: '16px' }}>No survey data found</p>
        <p style={{ fontSize: '15px', color: '#5a6661', marginBottom: '28px' }}>Please take the survey first to see your personalised results.</p>
        <Link href="/energy-survey" style={{ padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>
          Take the survey →
        </Link>
      </div>
    );
  }

  const rating = getRating(results.percentVsAvgKwh);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '64px 32px 48px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '16px' }}>Your energy report</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px' }}>
            Here&apos;s how your household uses energy
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(253,252,248,0.65)' }}>
            Based on your responses — {data?.city && data?.state ? `${data.city}, ${data.state}` : 'India'} · {data?.household_size || '—'} people · {data?.home_type?.replace('_', ' ') || '—'}
          </p>
        </div>
      </section>

      {/* ── SCORE CARD ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>

            {/* Rating */}
            <div style={{ padding: '32px', borderRadius: '20px', background: rating.bg, border: `2px solid ${rating.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: rating.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Energy rating</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: '700', color: rating.color, margin: '0 0 8px', lineHeight: 1 }}>{rating.label}</p>
              <p style={{ fontSize: '13px', color: '#5a6661', lineHeight: 1.5 }}>{rating.desc}</p>
            </div>

            {/* Key stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Monthly consumption',    value: `${results.kwh} kWh`,         sub: results.percentVsAvgKwh > 0 ? `${results.percentVsAvgKwh}% above avg` : `${Math.abs(results.percentVsAvgKwh)}% below avg`, subColor: results.percentVsAvgKwh > 0 ? '#dc2626' : '#356452' },
                { label: 'Monthly bill',            value: `₹${results.bill.toLocaleString()}`, sub: results.percentVsAvgBill > 0 ? `${results.percentVsAvgBill}% above avg` : `${Math.abs(results.percentVsAvgBill)}% below avg`, subColor: results.percentVsAvgBill > 0 ? '#dc2626' : '#356452' },
                { label: 'Monthly carbon footprint', value: `${results.monthlyCarbon} kg CO₂`, sub: 'from electricity', subColor: '#8a948f' },
                { label: 'Annual carbon footprint',  value: `${results.annualCarbon} tonnes`, sub: `= ${results.treesNeeded} trees to offset`, subColor: '#8a948f' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0' }}>
                  <p style={{ fontSize: '12px', color: '#8a948f', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: '#0d2318', margin: '0 0 4px' }}>{s.value}</p>
                  <p style={{ fontSize: '12px', color: s.subColor, fontWeight: '500' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vs national average */}
          <div style={{ padding: '20px 24px', borderRadius: '14px', background: '#fff', border: '1px solid #e5ddd0', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318' }}>How you compare to the national average:</p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '4px' }}>Your household</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{results.kwh} kWh</p>
              </div>
              <div style={{ fontSize: '24px', color: '#8a948f', display: 'flex', alignItems: 'center' }}>vs</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '4px' }}>National average</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', color: '#356452' }}>{results.nationalAvgKwh} kWh</p>
              </div>
              <div style={{ fontSize: '24px', color: '#8a948f', display: 'flex', alignItems: 'center' }}>·</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '4px' }}>Your carbon/month</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', color: '#d97706' }}>{results.monthlyCarbon} kg</p>
              </div>
              <div style={{ fontSize: '24px', color: '#8a948f', display: 'flex', alignItems: 'center' }}>vs</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#8a948f', marginBottom: '4px' }}>National avg carbon</p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', color: '#356452' }}>{results.nationalAvgCarbon} kg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLAR SAVINGS ── */}
      {!results.hasSolar && (
        <section style={{ background: '#0d2318', padding: '48px 20px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Solar opportunity</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '28px' }}>
              What switching to solar could mean for your household
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { icon: '💰', label: 'Monthly bill saving',    value: `₹${results.solarMonthlyBillSaving.toLocaleString()}`,   sub: `₹${results.solarAnnualSaving.toLocaleString()} per year` },
                { icon: '🌍', label: 'Annual CO₂ avoided',     value: `${results.solarAnnualCarbonSaving} tonnes`,              sub: `= ${Math.round(results.solarAnnualCarbonSaving / 0.021)} trees planted` },
                { icon: '📅', label: 'System payback period',  value: `~${results.solarPaybackYears} years`,                   sub: 'After PM-KUSUM subsidy' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>{s.icon}</span>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '700', color: '#f59e0b', margin: '0 0 4px' }}>{s.value}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#fdfcf8', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '12px', color: '#7aaa8e' }}>{s.sub}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#477e67', marginTop: '20px', fontStyle: 'italic' }}>
              * Estimates based on 50% average bill reduction from a 4kW rooftop system. Actual savings vary by location, roof area, and system size.
            </p>
          </div>
        </section>
      )}

      {/* ── PERSONALISED TIPS ── */}
      <section style={{ background: '#fff', padding: '48px 32px 64px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Recommendations</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '28px' }}>
            Your personalised green energy tips
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              ...(results.acCount > 0 ? [{ num: '01', title: 'Upgrade your AC to 5-star BEE rating', desc: `You have ${results.acCount} AC${results.acCount > 1 ? 's' : ''}. Switching to an inverter AC with a 5-star BEE rating can reduce AC energy consumption by 30–40%, potentially saving ₹${Math.round(results.bill * 0.15).toLocaleString()}–₹${Math.round(results.bill * 0.25).toLocaleString()} per month.`, impact: 'High impact' }] : []),
              ...(!results.hasSolar ? [{ num: results.acCount > 0 ? '02' : '01', title: 'Consider rooftop solar installation', desc: `Based on your consumption of ${results.kwh} kWh/month, a rooftop solar system could save you ~₹${results.solarMonthlyBillSaving.toLocaleString()} per month and reduce your carbon footprint by ${results.solarAnnualCarbonSaving} tonnes CO₂ annually. Check PM-KUSUM subsidies for reduced upfront cost.`, impact: 'Very high impact' }] : []),
              { num: '03', title: 'Switch all lighting to LED', desc: 'If you haven\'t already, replacing all incandescent and CFL bulbs with LED bulbs reduces lighting energy use by 60–80%. A typical household saves ₹200–400 per month on lighting alone.', impact: 'Medium impact' },
              { num: '04', title: 'Use appliances during off-peak hours', desc: 'Running washing machines, dishwashers, and water heaters at night (10pm–6am) can reduce your bill if your DISCOM offers time-of-use tariffs. Check with your electricity provider.', impact: 'Low–Medium impact' },
            ].map((tip) => (
              <div key={tip.num} style={{ display: 'flex', gap: '20px', padding: '24px', borderRadius: '14px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
                <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: '#0d2318', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>{tip.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#0d2318', margin: 0 }}>{tip.title}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#356452', background: '#f0f7f4', padding: '3px 10px', borderRadius: '999px', flexShrink: 0 }}>{tip.impact}</span>
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#5a6661', margin: 0 }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#060f0b', padding: '64px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '16px' }}>
            Your data helps the research
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#7aaa8e', marginBottom: '32px' }}>
            Your response has been added to Agastya&apos;s dataset. See how your household compares with others across India on the Research page.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/research" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 26px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
              See research findings →
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 26px', borderRadius: '999px', border: '1px solid rgba(253,252,248,0.2)', color: 'rgba(253,252,248,0.75)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}