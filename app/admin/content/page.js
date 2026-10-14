import { DEFAULT_CONTENT } from '@/lib/site-content';
import { getSiteContentFresh } from '@/lib/site-content-server';
import ContentEditor from '../components/ContentEditor';

export const metadata = { title: 'Website content' };
export const dynamic = 'force-dynamic';

export default async function ContentPage() {
  const content = await getSiteContentFresh();
  return <ContentEditor initialContent={content} defaults={DEFAULT_CONTENT} />;
}
