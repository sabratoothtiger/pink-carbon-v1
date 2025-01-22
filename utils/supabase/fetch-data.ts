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

async function getStatusData(): Promise<{
  colorMap: Record<number, "success" | "info" | "secondary" | "contrast" | "warning" | "danger" | null>;
  nameMap: Record<number, string>;
}> {
  const supabase = createClient();

  // Fetch the data from the "statuses" table
  const { data, error } = await supabase
    .from("statuses")
    .select("id, severity_color, name_internal")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching statuses:", error);
    return { colorMap: {}, nameMap: {} };
  }

  // Map the data into separate dictionaries
  const colorMap: Record<number, "success" | "info" | "secondary" | "contrast" | "warning" | "danger" | null> = {};
  const nameMap: Record<number, string> = {};

  data?.forEach(({ id, severity_color, name_internal }) => {
    colorMap[id] = severity_color;
    nameMap[id] = name_internal;
  });

  return { colorMap, nameMap };
}

async function getExtensionData(): Promise<Record<number, string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("extension_date_options")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching extension data:", error);
    return {};
  }

  const extensionMap: Record<number, string> = {};
  data?.forEach(({ id, name }) => {
    extensionMap[id] = name;
  });

  return extensionMap;
}


async function getMaxItemPosition(teamId: number) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_max_position_by_team", {teamId});

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
