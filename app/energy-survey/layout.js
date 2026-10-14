import { OG_IMAGES } from '@/lib/seo';

const DESCRIPTION = 'A 2-minute survey that gives you a personalised breakdown of your household’s electricity use, carbon footprint and solar savings.';

export const metadata = {
  title: 'Check your energy use',
  description: DESCRIPTION,
  openGraph: {
    title: 'Check your energy use · Agastya Khanna',
    description: DESCRIPTION,
    images: OG_IMAGES,
  },
};

export default function EnergySurveyLayout({ children }) {
  return children;
}
