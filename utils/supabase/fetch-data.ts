import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getWorkqueueData() {
  const { data, error } = await supabase.from('workqueue').select('*').order('position', { ascending: true });

  if (error) {
    console.error('Error fetching workqueue data:', error);
    return null;
  }

  return data;
}

async function getStatusData() {
    const { data, error } = await supabase.from('statuses').select('*');
  
    if (error) {
      console.error('Error fetching status data:', error);
      return null;
    }
  
    return data;
  }


export { getWorkqueueData, getStatusData };