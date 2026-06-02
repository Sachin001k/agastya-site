import { createClient } from '@/lib/supabase-server';
import ConversationEditor from '../../components/ConversationEditor';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Conversation' };

export default async function EditConversationPage({ params }) {
  const supabase = createClient();
  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!conversation) notFound();
  return <ConversationEditor initialData={{ ...conversation, duration_seconds: conversation.duration_seconds ? Math.round(conversation.duration_seconds / 60) : '' }} />;
}
