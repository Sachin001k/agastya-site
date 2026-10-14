import { createClient } from '@/lib/supabase-server';
import SurveyClient from '../components/SurveyClient';

export const metadata = { title: 'Survey responses' };
export const dynamic = 'force-dynamic';

export default async function SurveyPage() {
  const supabase = createClient();
  const { data } = await supabase.from('energy_submissions').select('*').order('submitted_at', { ascending: false });
  return <SurveyClient initialResponses={data || []} />;
}
