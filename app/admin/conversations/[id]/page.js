import { createClient } from '@/lib/supabase-server';
import ConversationEditor from '../../components/ConversationEditor';
import { notFound } from 'next/navigation';
import { loadConversationCovers } from '@/lib/covers-server';

export const metadata = { title: 'Edit Conversation' };

export default async function EditConversationPage({ params }) {
  const supabase = createClient();
  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!conversation) notFound();
  const covers = await loadConversationCovers();
  return <ConversationEditor coverUrl={covers[conversation.slug] || null} initialData={{ ...conversation, duration_seconds: conversation.duration_seconds ? Math.round(conversation.duration_seconds / 60) : '' }} />;
}
