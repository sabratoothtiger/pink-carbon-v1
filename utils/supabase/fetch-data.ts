import { createClient } from "@/utils/supabase/client";

async function getWorkqueueData() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workqueue")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching workqueue data:", error);
    return null;
  }

  return data;
}

async function getStatusData() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching status data:", error);
    return null;
  }

  return data;
}

async function getExtensionData() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("extension_date_options")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching status data:", error);
    return null;
  }

  return data;
}

async function getMaxItemPosition() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_max_position");

  if (error) {
    console.error("Error fetching position:", error);
    return;
  }

  return data;
}

export {
  getWorkqueueData,
  getStatusData,
  getExtensionData,
  getMaxItemPosition,
};
