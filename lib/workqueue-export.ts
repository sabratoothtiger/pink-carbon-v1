import { createClient } from "@/lib/supabase/client";
import {
  getExtensionData,
  getStatusExternalData,
  getStatusInternalData,
} from "@/lib/supabase/fetch-data";
import { formatLocalizedDate, formatLocalizedDateTime } from "@/utils/utils";
import { stripHtml } from "@/utils/csv-export";

export interface WorkqueueExportColumn {
  key: string;
  label: string;
}

// Canonical column list for workqueue exports. Order here is the default
// column order in the exported file.
export const WORKQUEUE_EXPORT_COLUMNS: WorkqueueExportColumn[] = [
  { key: "position", label: "Position" },
  { key: "identifier", label: "Identifier" },
  { key: "return_year", label: "Return Year" },
  { key: "received_at", label: "Received On" },
  { key: "status_internal", label: "Internal Status" },
  { key: "status_external", label: "External Status" },
  { key: "extension", label: "Extension Date" },
  { key: "external_queue_position", label: "External Queue Position" },
  { key: "notes", label: "Notes" },
  { key: "last_updated_at", label: "Last Updated" },
  { key: "last_updated_by", label: "Last Updated By" },
];

export const DEFAULT_EXPORT_COLUMN_KEYS = WORKQUEUE_EXPORT_COLUMNS.map((c) => c.key);

interface FetchWorkqueueExportDataOptions {
  accountId: number;
  returnYear: number | null;
  includeCompleted: boolean;
}

/**
 * Fetches workqueue rows for an account (optionally scoped to a return year
 * and excluding completed items), along with a set of per-column value
 * getters that turn a raw row into human-readable export values (status
 * names instead of ids, formatted dates, plain-text notes, etc).
 */
export async function fetchWorkqueueExportData({
  accountId,
  returnYear,
  includeCompleted,
}: FetchWorkqueueExportDataOptions) {
  const supabase = createClient();

  const [
    { nameMap: statusInternalNames },
    { nameMap: statusExternalNames },
    extensions,
  ] = await Promise.all([
    getStatusInternalData(),
    getStatusExternalData(),
    getExtensionData(),
  ]);

  // The rest of the app identifies the "Completed" status by name rather
  // than a hardcoded id (see the row-expansion template in
  // components/workqueue/table.tsx), so match the same way here.
  const completedStatusId = Object.entries(statusInternalNames).find(
    ([, name]) => name === "Completed"
  )?.[0];

  let query = supabase
    .from("workqueue")
    .select("*")
    .eq("account_id", accountId)
    .order("return_year", { ascending: false })
    .order("position", { ascending: true, nullsFirst: false });

  if (returnYear !== null) {
    query = query.eq("return_year", returnYear);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  let items = data ?? [];
  if (!includeCompleted && completedStatusId !== undefined) {
    items = items.filter((item) => String(item.status_id) !== completedStatusId);
  }

  const valueGetters: Record<string, (item: any) => string | number> = {
    position: (item) => item.position ?? "",
    identifier: (item) => item.identifier ?? "",
    return_year: (item) => item.return_year ?? "",
    received_at: (item) => (item.received_at ? formatLocalizedDate(item.received_at, "short") : ""),
    status_internal: (item) => statusInternalNames[item.status_id] ?? "",
    status_external: (item) => statusExternalNames[item.status_id] ?? "",
    extension: (item) => (item.extension_date_id ? extensions[item.extension_date_id] ?? "" : ""),
    external_queue_position: (item) => item.external_queue_position ?? "",
    notes: (item) => (item.notes ? stripHtml(item.notes) : ""),
    last_updated_at: (item) => (item.last_updated_at ? formatLocalizedDateTime(item.last_updated_at) : ""),
    last_updated_by: (item) => item.last_updated_by ?? "",
  };

  return { items, valueGetters };
}

/**
 * Fetches the distinct return years present in an account's workqueue,
 * sorted descending, for populating a year picker.
 */
export async function fetchWorkqueueReturnYears(accountId: number): Promise<number[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workqueue")
    .select("return_year")
    .eq("account_id", accountId);

  if (error) {
    throw error;
  }

  return [...new Set((data ?? []).map((row) => row.return_year))].sort((a, b) => b - a);
}

/**
 * Builds a 2D array of export rows (one array per row, in column order) for
 * the given items and selected columns.
 */
export function buildExportRows(
  items: any[],
  valueGetters: Record<string, (item: any) => string | number>,
  columnKeys: string[]
): (string | number)[][] {
  return items.map((item) => columnKeys.map((key) => valueGetters[key]?.(item) ?? ""));
}
