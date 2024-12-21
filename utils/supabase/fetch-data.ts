import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

async function getWorkqueueData() {
  const { data, error } = await supabase.from('workqueue').select('*').order('position', { ascending: true });

  if (error) {
    console.error('Error fetching workqueue data:', error);
    return null;
  }

  return data;
}

async function getStatusData() {
    const { data, error } = await supabase.from('statuses').select('*').order('id', { ascending: true });
  
    if (error) {
      console.error('Error fetching status data:', error);
      return null;
    }
  
    return data;
  }

  async function getMaxItemPosition() {
      const { data, error } = await supabase.rpc("get_max_position");

      if (error) {
        console.error("Error fetching position:", error);
        return;
      }

    return data
}

export { getWorkqueueData, getStatusData, getMaxItemPosition };