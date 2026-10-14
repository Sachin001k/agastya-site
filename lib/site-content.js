// Editable website copy. Stored as one JSON file in the public `site-content`
// storage bucket and edited from /admin/content. Anything missing from the
// stored file falls back to these defaults.

export const CONTENT_BUCKET = 'site-content';
export const CONTENT_FILE = 'content.json';
export const CONTENT_TAG = 'site-content';

export const DEFAULT_CONTENT = {
  home: {
    badge: 'ECONOMICS · ENERGY · POLICY',
    headline: 'Rethinking energy',
    headline_highlight: 'through economics',
    subtext: 'Examining how price signals, policy incentives, and household behaviour shape India’s clean-energy transition.',
    tagline: 'Primary research · Data-driven analysis · Energy economics',
    mission_title: 'India’s energy transition is fundamentally an economics problem.',
    mission_text: 'Agastya Khanna is an Economics student whose research examines how household spending patterns, government subsidies, and market incentives determine whether families switch to clean energy — or don’t.',
  },
  about: {
    role: 'Economics Student & Energy Researcher',
    intro: 'Agastya Khanna is a high-school student with a deep interest in economics and the future of energy. His work focuses on how policy, behaviour, and technology come together to enable India’s shift toward renewable sources.',
    photo_url: '',
    bio_heading: 'An economist’s lens on India’s energy future',
    bio: [
      'Agastya Khanna is a high-school student whose academic interests sit at the intersection of economics and environmental policy. Growing up in India, he became increasingly curious about why clean energy adoption — despite its obvious benefits — remains slow and uneven across households and regions.',
      'His research takes an economics-first approach: rather than treating energy transition as a purely technical problem, he examines the price signals, subsidy structures, and behavioural incentives that shape real household decisions.',
      'This website documents that ongoing research journey — from early essays to field data to conversations with people working on these problems every day.',
    ],
    facts: [
      { label: 'Discipline', value: 'Economics' },
      { label: 'Focus', value: 'Energy Policy' },
      { label: 'Focus region', value: 'India' },
    ],
    milestones: [
      { tag: 'Essay', title: 'Carbon offset markets', desc: 'Wrote “False Promises”, an essay for the HUEA Essay Contest 2025 (Environment) arguing that direct emission cuts beat carbon offset schemes.' },
      { tag: 'Essay', title: 'Carbon borders and global pricing', desc: 'Used a game-theory model to ask whether the EU’s Carbon Border Adjustment Mechanism can spread carbon pricing without deepening global inequality.' },
      { tag: 'Essay', title: 'Decentralised renewable energy', desc: 'Examined how off-grid and rooftop solar can deliver reliable, productive power to rural communities across the Global South.' },
      { tag: 'June 2026', title: 'Conversations series', desc: 'Interviewed Mr. Sudhir Vasudeva, former Chairman & MD of ONGC, and Gautam Handa, Founder of VGS, on India’s energy transition.' },
      { tag: '2026', title: 'Household energy survey launched', desc: 'Launched a primary survey of household electricity use and solar adoption across India.' },
    ],
    achievements: [],
  },
  research: {
    target_households: 500,
    status_text: 'Data collection is underway. Findings will be published here once the sample is large enough to be meaningful.',
  },
  contact: {
    intro: 'Whether you want to collaborate, share your energy story, give feedback on the research, or just say hello — Agastya would love to hear from you.',
    email: '', // add once the domain's mailbox exists (Admin → Website content)
    linkedin: '',
    twitter: '',
    instagram: '',
  },
  footer: {
    blurb: 'Economics student examining India’s clean energy transition through data and policy research.',
  },
};

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

// Stored values win; arrays are replaced wholesale; unknown keys are dropped.
export function mergeContent(defaults, stored) {
  if (!isPlainObject(stored)) return defaults;
  const out = {};
  for (const key of Object.keys(defaults)) {
    const d = defaults[key];
    const s = stored[key];
    if (isPlainObject(d)) out[key] = mergeContent(d, s);
    else if (Array.isArray(d)) out[key] = Array.isArray(s) ? s : d;
    else if (typeof d === 'number') out[key] = Number.isFinite(Number(s)) && s !== '' && s != null ? Number(s) : d;
    else out[key] = typeof s === 'string' ? s : d;
  }
  return out;
}

export function contentUrl() {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${CONTENT_BUCKET}/${CONTENT_FILE}`;
}

// Turns a handle or URL into a clickable link.
export function socialHref(kind, value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, '').replace(/^(www\.)?(linkedin\.com\/in\/|twitter\.com\/|x\.com\/|instagram\.com\/)/i, '');
  if (kind === 'linkedin') return `https://www.linkedin.com/in/${handle}`;
  if (kind === 'twitter') return `https://x.com/${handle}`;
  if (kind === 'instagram') return `https://www.instagram.com/${handle}`;
  return value;
}

