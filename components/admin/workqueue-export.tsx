"use client";

import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { createClient } from "@/lib/supabase/client";
import {
  getExtensionData,
  getStatusExternalData,
  getStatusInternalData,
} from "@/lib/supabase/fetch-data";
import { formatLocalizedDate, formatLocalizedDateTime } from "@/utils/utils";
import { buildCsv, downloadCsv, stripHtml } from "@/utils/csv-export";
import { format } from "date-fns";

interface WorkqueueExportProps {
  accountId: number;
  accountName: string;
}

export default function WorkqueueExport({ accountId, accountName }: WorkqueueExportProps) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [includeCompleted, setIncludeCompleted] = useState<boolean>(true);
  const toast = useRef<Toast>(null);
  const supabase = createClient();

  const yearOptions = [
    { label: "All Years", value: null },
    ...years.map((year) => ({ label: `${year}`, value: year })),
  ];

  const openDialog = async () => {
    setDialogVisible(true);
    setLoadingOptions(true);
    try {
      const { data, error } = await supabase
        .from("workqueue")
        .select("return_year")
        .eq("account_id", accountId);

      if (error) {
        throw error;
      }

      const uniqueYears = [...new Set((data ?? []).map((row) => row.return_year))].sort(
        (a, b) => b - a
      );
      setYears(uniqueYears);
    } catch (error) {
      console.error("Error fetching return years:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load available return years.",
        life: 3000,
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
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

      if (selectedYear !== null) {
        query = query.eq("return_year", selectedYear);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      let exportItems = data ?? [];
      if (!includeCompleted && completedStatusId !== undefined) {
        exportItems = exportItems.filter(
          (item) => String(item.status_id) !== completedStatusId
        );
      }

      if (exportItems.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Nothing to export",
          detail: "There are no items matching the selected options.",
          life: 3000,
        });
        return;
      }

      const headers = [
        "Position",
        "Identifier",
        "Return Year",
        "Received On",
        "Internal Status",
        "External Status",
        "Extension Date",
        "External Queue Position",
        "Notes",
        "Last Updated",
        "Last Updated By",
      ];

      const rows = exportItems.map((item) => [
        item.position ?? "",
        item.identifier ?? "",
        item.return_year ?? "",
        item.received_at ? formatLocalizedDate(item.received_at, "short") : "",
        statusInternalNames[item.status_id] ?? "",
        statusExternalNames[item.status_id] ?? "",
        item.extension_date_id ? extensions[item.extension_date_id] ?? "" : "",
        item.external_queue_position ?? "",
        item.notes ? stripHtml(item.notes) : "",
        item.last_updated_at ? formatLocalizedDateTime(item.last_updated_at) : "",
        item.last_updated_by ?? "",
      ]);

      const csvContent = buildCsv(headers, rows);
      const accountSlug = accountName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "account";
      const yearLabel = selectedYear ?? "all-years";
      const dateStamp = format(new Date(), "yyyy-MM-dd");

      downloadCsv(`${accountSlug}-workqueue-${yearLabel}-${dateStamp}.csv`, csvContent);

      toast.current?.show({
        severity: "success",
        summary: "Export complete",
        detail: `Exported ${exportItems.length} item${exportItems.length === 1 ? "" : "s"} to CSV.`,
        life: 3000,
      });
      setDialogVisible(false);
    } catch (error) {
      console.error("Error exporting workqueue:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to export workqueue data.",
        life: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} disabled={exporting} />
      <Button
        label="Export"
        icon="pi pi-download"
        onClick={handleExport}
        loading={exporting}
      />
    </React.Fragment>
  );

  return (
    <>
      <Toast ref={toast} position="bottom-left" />
      <Button
        label="Export Workqueue"
        icon="pi pi-arrow-right"
        iconPos="right"
        className="p-button-sm w-full"
        onClick={openDialog}
      />

      <Dialog
        visible={dialogVisible}
        style={{ width: "28rem" }}
        breakpoints={{ "641px": "90vw" }}
        header="Export Workqueue"
        modal
        footer={dialogFooter}
        onHide={hideDialog}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="export-year" className="text-xs font-medium text-gray-400 block mb-1">
              Return Year
            </label>
            <Dropdown
              id="export-year"
              value={selectedYear}
              options={yearOptions}
              onChange={(e) => setSelectedYear(e.value)}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Year"
              className="w-full"
              disabled={loadingOptions}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              inputId="export-include-completed"
              checked={includeCompleted}
              onChange={(e) => setIncludeCompleted(e.checked ?? false)}
            />
            <label htmlFor="export-include-completed" className="text-sm">
              Include completed items
            </label>
          </div>
        </div>
      </Dialog>
    </>
  );
}
