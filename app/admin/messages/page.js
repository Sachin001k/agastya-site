import { createClient } from '@/lib/supabase-server';
import MessagesClient from '../components/MessagesClient';

export const metadata = { title: 'Messages' };
export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('feedback_submissions').select('*').order('submitted_at', { ascending: false });
  return <MessagesClient initialMessages={data || []} />;
}
