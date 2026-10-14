import { OG_IMAGES } from '@/lib/seo';
import { getSiteContent } from '@/lib/site-content-server';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Agastya Khanna about collaboration, feedback or the research.',
  openGraph: { title: 'Contact · Agastya Khanna', description: 'Get in touch with Agastya Khanna about collaboration, feedback or the research.', images: OG_IMAGES },
};

export const revalidate = 60;

export default async function ContactPage() {
  const { contact } = await getSiteContent();
  return <ContactClient contact={contact} />;
}
