import { createClient } from '@/lib/supabase-server';
import SubmissionsClient from '../components/SubmissionsClient';

export const metadata = { title: 'Submissions' };

export default async function SubmissionsPage() {
  const supabase = createClient();

  const [{ data: energy }, { data: feedback }] = await Promise.all([
    supabase.from('energy_submissions').select('*').order('submitted_at', { ascending: false }),
    supabase.from('feedback_submissions').select('*').order('submitted_at', { ascending: false }),
  ]);

  return <SubmissionsClient energy={energy || []} feedback={feedback || []} />;
}
