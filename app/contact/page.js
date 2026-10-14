import { getSiteContent } from '@/lib/site-content';
import ContactClient from './ContactClient';

export const revalidate = 60;

export default async function ContactPage() {
  const { contact } = await getSiteContent();
  return <ContactClient contact={contact} />;
}
