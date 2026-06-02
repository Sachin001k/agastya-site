'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnergySurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    household_size: '',
    home_type: '',
    home_size_sqft: '',
    city: '',
    state: '',
    country: 'India',
    monthly_electricity_kwh: '',
    monthly_electricity_bill: '',
    primary_energy_source: '',
    has_solar: false,
    ac_count: '0',
    ev_owner: false,
    appliances_count: '',
    email: '',
    consent_research_use: false,
    consent_aggregate_display: false,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.consent_research_use) {
      alert('Please give consent for research use to continue.');
      return;
    }
    setLoading(true);
    try {
      // Save to Supabase
      const { createClient } = await import('@/lib/supabase-client');
      const supabase = createClient();

      const payload = {
        household_size:             parseInt(form.household_size) || null,
        home_type:                  form.home_type || null,
        home_size_sqft:             parseInt(form.home_size_sqft) || null,
        city:                       form.city || null,
        state:                      form.state || null,
        country:                    form.country,
        monthly_electricity_kwh:    parseFloat(form.monthly_electricity_kwh) || null,
        monthly_electricity_bill:   parseFloat(form.monthly_electricity_bill) || null,
        primary_energy_source:      form.primary_energy_source || null,
        has_solar:                  form.has_solar,
        ac_count:                   parseInt(form.ac_count) || 0,
        ev_owner:                   form.ev_owner,
        appliances_count:           parseInt(form.appliances_count) || null,
        email:                      form.email || null,
        consent_research_use:       form.consent_research_use,
        consent_aggregate_display:  form.consent_aggregate_display,
      };

      const { error } = await supabase
        .from('energy_submissions')
        .insert([payload]);

      if (error) {
        console.error('Supabase error:', error);
        // Still continue to results even if save fails
      }

      // Store in sessionStorage for results page
      sessionStorage.setItem('survey_data', JSON.stringify(form));
      router.push('/energy-survey/results');
    } catch (err) {
      console.error(err);
      // Still redirect even if there's an error
      sessionStorage.setItem('survey_data', JSON.stringify(form));
      router.push('/energy-survey/results');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e5ddd0',
    fontSize: '15px',
    color: '#0d2318',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0d2318',
    marginBottom: '8px',
  };

  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  const steps = ['Your home', 'Energy use', 'About you'];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: '#060f0b', padding: '64px 32px 48px', borderBottom: '1px solid #1a4a2a' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '999px', padding: '5px 14px', marginBottom: '24px', background: 'rgba(245,158,11,0.08)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>ENERGY SURVEY</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Check your <span style={{ color: '#f59e0b' }}>energy use</span>
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', marginBottom: '0' }}>
            Takes 2 minutes. Get a personalised breakdown of your household&apos;s energy consumption, carbon footprint, and tips to switch to clean energy.
          </p>

          {/* What you get */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['📊 Personal consumption report', '🌍 Your carbon footprint', '💡 Green energy tips', '💰 Estimated savings with solar'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', color: '#7aaa8e' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section style={{ background: '#f5f0e8', padding: '48px 32px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', alignItems: 'center' }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700',
                  background: step > i + 1 ? '#356452' : step === i + 1 ? '#f59e0b' : '#e5ddd0',
                  color: step > i + 1 ? '#fff' : step === i + 1 ? '#060f0b' : '#8a948f',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: step === i + 1 ? '600' : '400', color: step === i + 1 ? '#0d2318' : '#8a948f' }}>{s}</span>
                {i < steps.length - 1 && <div style={{ width: '32px', height: '2px', background: step > i + 1 ? '#356452' : '#e5ddd0', marginLeft: '4px' }} />}
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e5ddd0', padding: '36px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>

            {/* STEP 1 — Your home */}
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>Tell us about your home</h2>
                <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '32px' }}>Basic details help us compare your usage with similar households.</p>

                <div className='two-col-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Number of people in household</label>
                    <select style={selectStyle} value={form.household_size} onChange={e => update('household_size', e.target.value)}>
                      <option value="">Select</option>
                      {[1,2,3,4,5,6,7,'8+'].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Type of home</label>
                    <select style={selectStyle} value={form.home_type} onChange={e => update('home_type', e.target.value)}>
                      <option value="">Select</option>
                      <option value="apartment">Apartment / Flat</option>
                      <option value="independent_house">Independent house</option>
                      <option value="villa">Villa</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Approximate home size (sq ft) <span style={{ fontWeight: '400', color: '#8a948f' }}>— optional</span></label>
                    <input type="number" placeholder="e.g. 1200" style={inputStyle} value={form.home_size_sqft} onChange={e => update('home_size_sqft', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Number of ACs</label>
                    <select style={selectStyle} value={form.ac_count} onChange={e => update('ac_count', e.target.value)}>
                      {[0,1,2,3,4,'5+'].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" placeholder="e.g. Mumbai" style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select style={selectStyle} value={form.state} onChange={e => update('state', e.target.value)}>
                      <option value="">Select state</option>
                      {['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.ev_owner} onChange={e => update('ev_owner', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                    <span style={{ fontSize: '14px', color: '#5a6661' }}>I own an electric vehicle (EV)</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2 — Energy use */}
            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>Your energy consumption</h2>
                <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '32px' }}>Check your electricity bill for these numbers, or give your best estimate.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className='two-col-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Monthly electricity consumption (kWh)</label>
                      <input type="number" placeholder="e.g. 250" style={inputStyle} value={form.monthly_electricity_kwh} onChange={e => update('monthly_electricity_kwh', e.target.value)} />
                      <p style={{ fontSize: '12px', color: '#8a948f', marginTop: '6px' }}>Found on your electricity bill</p>
                    </div>
                    <div>
                      <label style={labelStyle}>Monthly electricity bill (₹)</label>
                      <input type="number" placeholder="e.g. 2500" style={inputStyle} value={form.monthly_electricity_bill} onChange={e => update('monthly_electricity_bill', e.target.value)} />
                      <p style={{ fontSize: '12px', color: '#8a948f', marginTop: '6px' }}>If you don&apos;t know kWh, bill amount works too</p>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Primary energy source</label>
                    <div className='energy-source-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      {[
                        { value: 'grid',      label: 'Grid only',     icon: '🏭' },
                        { value: 'solar',     label: 'Solar only',    icon: '☀️' },
                        { value: 'mixed',     label: 'Grid + Solar',  icon: '⚡' },
                        { value: 'generator', label: 'Generator',     icon: '🔋' },
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => update('primary_energy_source', opt.value)}
                          style={{
                            padding: '16px 12px',
                            borderRadius: '12px',
                            border: `2px solid ${form.primary_energy_source === opt.value ? '#f59e0b' : '#e5ddd0'}`,
                            background: form.primary_energy_source === opt.value ? 'rgba(245,158,11,0.08)' : '#fff',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>{opt.icon}</span>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: form.primary_energy_source === opt.value ? '#d97706' : '#5a6661' }}>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.has_solar} onChange={e => update('has_solar', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                      <span style={{ fontSize: '14px', color: '#5a6661' }}>I have solar panels installed at home</span>
                    </label>
                  </div>

                  <div>
                    <label style={labelStyle}>Approximate number of major appliances <span style={{ fontWeight: '400', color: '#8a948f' }}>— optional</span></label>
                    <p style={{ fontSize: '12px', color: '#8a948f', marginBottom: '8px' }}>Count: AC, fridge, washing machine, TV, geyser, microwave etc.</p>
                    <input type="number" placeholder="e.g. 6" style={{ ...inputStyle, maxWidth: '200px' }} value={form.appliances_count} onChange={e => update('appliances_count', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — About you */}
            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '600', color: '#0d2318', marginBottom: '8px' }}>Almost done</h2>
                <p style={{ fontSize: '14px', color: '#8a948f', marginBottom: '32px' }}>Your email is optional — only needed if you want us to send you your report.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={labelStyle}>Email address <span style={{ fontWeight: '400', color: '#8a948f' }}>— optional</span></label>
                    <input type="email" placeholder="you@example.com" style={{ ...inputStyle, maxWidth: '400px' }} value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>

                  {/* Consent */}
                  <div style={{ padding: '20px 24px', borderRadius: '12px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '16px' }}>Research consent</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.consent_research_use} onChange={e => update('consent_research_use', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: '#5a6661', lineHeight: 1.6 }}>
                          <strong style={{ color: '#0d2318' }}>Required:</strong> I consent to my anonymised responses being used in Agastya Khanna&apos;s research on household energy consumption in India.
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={form.consent_aggregate_display} onChange={e => update('consent_aggregate_display', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: '#5a6661', lineHeight: 1.6 }}>
                          <strong style={{ color: '#0d2318' }}>Optional:</strong> I&apos;m happy for my anonymised data to be included in public-facing charts on the Research page.
                        </span>
                      </label>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#8a948f', lineHeight: 1.6 }}>
                    Your data is never sold or shared with third parties. It is used solely for academic research purposes. You can request deletion at any time by contacting us.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #f0ebe0' }}>
              {step > 1 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{ padding: '12px 24px', borderRadius: '999px', border: '1px solid #e5ddd0', background: '#fff', color: '#5a6661', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                >
                  ← Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  style={{ padding: '12px 28px', borderRadius: '999px', background: '#f59e0b', color: '#060f0b', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.consent_research_use}
                  style={{ padding: '12px 28px', borderRadius: '999px', background: form.consent_research_use ? '#f59e0b' : '#e5ddd0', color: form.consent_research_use ? '#060f0b' : '#8a948f', fontSize: '14px', fontWeight: '700', border: 'none', cursor: form.consent_research_use ? 'pointer' : 'not-allowed' }}
                >
                  {loading ? 'Calculating...' : 'Get my energy report →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}