import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import { getSiteContent } from '@/lib/site-content';

// Findings are not shown until the survey has a meaningful sample.
// Until then this page describes the research design rather than results.
export const revalidate = 60;

const researchQuestions = [
  { icon: '⚡', title: 'How much do households use — and pay?', desc: 'Monthly electricity consumption and bills across home types, household sizes and states.' },
  { icon: '☀️', title: 'Who is adopting solar?',               desc: 'How rooftop and mixed solar adoption differs by region, dwelling type and consumption level.' },
  { icon: '❄️', title: 'How much does cooling drive demand?',   desc: 'The link between air-conditioner ownership and household electricity use and cost.' },
  { icon: '🌍', title: 'What is the carbon cost?',              desc: 'Estimated household emissions from grid electricity, and what switching to solar would avoid.' },
];

const dataCollected = [
  'Household size and home type',
  'City and state',
  'Monthly electricity use (kWh) and bill',
  'Primary energy source — grid, solar, mixed or generator',
  'Number of air conditioners and major appliances',
  'Electric-vehicle ownership',
];

export default async function ResearchPage() {
  const { research } = await getSiteContent();
  const TARGET_HOUSEHOLDS = research.target_households;

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
            <span style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#fcd34d', fontWeight: '500' }}>RESEARCH · IN PROGRESS</span>
          </div>
          <div className="research-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }}>
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', fontWeight: '700', lineHeight: 1.1, color: '#fdfcf8', margin: '0 0 16px', letterSpacing: '-1px' }}>
                Household energy <span style={{ color: '#f59e0b' }}>survey</span>
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.75, color: 'rgba(253,252,248,0.65)', maxWidth: '440px' }}>
                A primary survey of how households across India use and pay for electricity — and what it would take for them to switch to solar.
              </p>
            </div>
            <div className="research-hero-stats" style={{ display: 'flex', gap: '24px', justifyContent: 'flex-end' }}>
              {[
                { label: 'Target households', value: `${TARGET_HOUSEHOLDS}+` },
                { label: 'Minutes to take part', value: '2' },
                { label: 'Status', value: 'Open' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: '600', color: '#f59e0b', margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: '#7aaa8e', marginTop: '4px', maxWidth: '90px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '36px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', color: '#fcd34d', margin: 0 }}>
              {research.status_text}{' '}
              <Link href="/energy-survey" style={{ color: '#f59e0b', fontWeight: '600', textDecoration: 'underline' }}>Take the survey →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── RESEARCH QUESTIONS ── */}
      <section style={{ background: '#f5f0e8', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a948f', marginBottom: '8px' }}>Research questions</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#0d2318', marginBottom: '36px' }}>What this research sets out to answer</h2>
          <div className='findings-grid research-four-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {researchQuestions.map((q, i) => (
              <div key={q.title} className={`reveal reveal-${i + 1} hover-card`} style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e5ddd0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{q.icon}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '600', color: '#0d2318', marginBottom: '8px', lineHeight: 1.35 }}>{q.title}</p>
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#5a6661' }}>{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT THE SURVEY COLLECTS ── */}
      <section style={{ background: '#fff', padding: '64px 20px' }}>
        <div className="research-two-col" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          <div className="reveal reveal-1">
            <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>The data</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '600', color: '#0d2318', lineHeight: 1.3, marginBottom: '16px' }}>
              What the survey collects
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661', marginBottom: '16px' }}>
              Each response captures a snapshot of one household&apos;s electricity use. Together, they will show how consumption, cost and solar adoption vary across India.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#5a6661' }}>
              Every participant gets an instant, personalised report on their own energy use and carbon footprint.
            </p>
          </div>
          <div className="reveal reveal-2" style={{ padding: '28px', borderRadius: '16px', background: '#f5f0e8', border: '1px solid #e5ddd0' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0d2318', marginBottom: '16px' }}>Questions cover</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dataCollected.map((d) => (
                <li key={d} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: '#2b332e' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginTop: '7px', flexShrink: 0 }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHEN FINDINGS ARRIVE ── */}
      <section style={{ background: '#060f0b', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Coming next</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '36px' }}>
            How the research will unfold
          </h2>
          <div className='cards-grid research-three-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { num: '01', title: 'Collect',  desc: `Gather responses from at least ${TARGET_HOUSEHOLDS} households across multiple states, in both urban and rural India.` },
              { num: '02', title: 'Analyse',  desc: 'Study consumption, bills and solar adoption by region and home type, alongside interviews with people working in the sector.' },
              { num: '03', title: 'Publish',  desc: 'Share the findings and policy recommendations on this page, with the full methodology and its limitations.' },
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

      {/* ── RECOMMENDATIONS ── */}
      <section style={{ background: '#0d2318', padding: '64px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="reveal reveal-1" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>Recommendations</p>
          <h2 className="reveal reveal-2" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: '600', color: '#fdfcf8', marginBottom: '36px' }}>
            Switching to green energy
          </h2>
          <div className='cards-grid research-three-col' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { num: '01', title: 'Rooftop solar installation',    desc: 'For households in high-sunlight regions, rooftop solar panels can reduce electricity bills by 40–60%. Central subsidies under the PM Surya Ghar: Muft Bijli Yojana make this increasingly accessible.' },
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
            How this research is being conducted
          </h2>
          <div className="reveal reveal-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Survey method',      value: 'Self-reported online survey' },
              { label: 'Sample size',        value: `Ongoing — target ${TARGET_HOUSEHOLDS}+ households` },
              { label: 'Geographic scope',   value: 'Urban and rural India, multiple states' },
              { label: 'Data collection',    value: 'Ongoing' },
              { label: 'Anonymisation',      value: 'All responses anonymised before analysis' },
              { label: 'Consent',            value: 'Explicit research consent required from every participant' },
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
              This is a self-reported survey with a non-random sample. Results will reflect respondents who chose to participate and may not be fully representative of the Indian population. The research is designed to be exploratory — identifying patterns and generating hypotheses rather than establishing definitive causal relationships.
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
            The more households take part, the more reliable the findings will be. Take the 2-minute survey and get your own personalised energy report.
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