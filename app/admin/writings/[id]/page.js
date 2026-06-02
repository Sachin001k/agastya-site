import { createClient } from '@/lib/supabase-server';
import WritingEditor from '../../components/WritingEditor';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Essay' };

export default async function EditWritingPage({ params }) {
  const supabase = createClient();
  const { data: writing } = await supabase
    .from('writings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!writing) notFound();
  return <WritingEditor initialData={writing} />;
}
