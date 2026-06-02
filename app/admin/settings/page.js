import { createClient } from '@/lib/supabase-server';
import SettingsClient from '../components/SettingsClient';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').single();
  return <SettingsClient initialSettings={settings} />;
}
