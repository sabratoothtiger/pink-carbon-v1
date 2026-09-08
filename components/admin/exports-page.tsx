"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import { format } from "date-fns";
import {
  DEFAULT_EXPORT_COLUMN_KEYS,
  WORKQUEUE_EXPORT_COLUMNS,
  buildExportRows,
  fetchWorkqueueExportData,
  fetchWorkqueueReturnYears,
} from "@/lib/workqueue-export";
import { buildCsv, downloadCsv } from "@/utils/csv-export";
import { downloadXlsx } from "@/utils/xlsx-export";

interface ExportsPageProps {
  accountId: number;
  accountName: string;
}

type ExportFormat = "csv" | "xlsx";

const FORMAT_OPTIONS: { label: string; value: ExportFormat }[] = [
  { label: "CSV", value: "csv" },
  { label: "Excel (.xlsx)", value: "xlsx" },
];

export default function ExportsPage({ accountId, accountName }: ExportsPageProps) {
  const [years, setYears] = useState<number[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [includeCompleted, setIncludeCompleted] = useState<boolean>(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_EXPORT_COLUMN_KEYS);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [exporting, setExporting] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadYears() {
      try {
        const uniqueYears = await fetchWorkqueueReturnYears(accountId);
        if (!cancelled) setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching return years:", error);
        if (!cancelled) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load available return years.",
            life: 3000,
          });
        }
      } finally {
        if (!cancelled) setLoadingYears(false);
      }
    }

    loadYears();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  const yearOptions = [
    { label: "All Years", value: null },
    ...years.map((year) => ({ label: `${year}`, value: year })),
  ];

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAllColumns = () => setSelectedColumns(DEFAULT_EXPORT_COLUMN_KEYS);
  const selectNoColumns = () => setSelectedColumns([]);

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "No columns selected",
        detail: "Select at least one column to export.",
        life: 3000,
      });
      return;
    }

    setExporting(true);
    try {
      const { items, valueGetters } = await fetchWorkqueueExportData({
        accountId,
        returnYear: selectedYear,
        includeCompleted,
      });

      if (items.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Nothing to export",
          detail: "There are no items matching the selected options.",
          life: 3000,
        });
        return;
      }

      // Preserve the canonical column order, restricted to what's selected.
      const orderedColumns = WORKQUEUE_EXPORT_COLUMNS.filter((col) =>
        selectedColumns.includes(col.key)
      );
      const headers = orderedColumns.map((col) => col.label);
      const rows = buildExportRows(items, valueGetters, orderedColumns.map((col) => col.key));

      const accountSlug =
        accountName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "account";
      const yearLabel = selectedYear ?? "all-years";
      const dateStamp = format(new Date(), "yyyy-MM-dd");
      const baseFilename = `${accountSlug}-workqueue-${yearLabel}-${dateStamp}`;

      if (exportFormat === "csv") {
        downloadCsv(`${baseFilename}.csv`, buildCsv(headers, rows));
      } else {
        downloadXlsx(`${baseFilename}.xlsx`, headers, rows);
      }

      toast.current?.show({
        severity: "success",
        summary: "Export complete",
        detail: `Exported ${items.length} item${items.length === 1 ? "" : "s"} to ${exportFormat.toUpperCase()}.`,
        life: 3000,
      });
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

  return (
    <div className="bg-surface-a border border-surface-border rounded-lg p-6 max-w-2xl">
      <Toast ref={toast} position="bottom-left" />
      <div className="flex items-center gap-3 mb-6">
        <i className="pi pi-download text-pink-500 text-2xl" />
        <h2 className="text-lg font-semibold text-primary">Export Workqueue</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="export-year" className="text-xs font-medium text-text-secondary block mb-1">
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
            className="w-full md:w-64"
            disabled={loadingYears}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            inputId="export-include-completed"
            checked={includeCompleted}
            onChange={(e) => setIncludeCompleted(e.checked ?? false)}
          />
          <label htmlFor="export-include-completed" className="text-sm text-primary">
            Include completed items
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-text-secondary">Columns</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={selectAllColumns}
                className="text-xs text-pink-500 hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={selectNoColumns}
                className="text-xs text-pink-500 hover:underline"
              >
                Select none
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 border border-surface-border rounded-md p-3">
            {WORKQUEUE_EXPORT_COLUMNS.map((col) => (
              <div key={col.key} className="flex items-center gap-2">
                <Checkbox
                  inputId={`export-col-${col.key}`}
                  checked={selectedColumns.includes(col.key)}
                  onChange={() => toggleColumn(col.key)}
                />
                <label htmlFor={`export-col-${col.key}`} className="text-sm text-primary">
                  {col.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary block mb-2">Format</label>
          <SelectButton
            value={exportFormat}
            options={FORMAT_OPTIONS}
            onChange={(e) => e.value && setExportFormat(e.value)}
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <Button
          label="Export"
          icon="pi pi-download"
          onClick={handleExport}
          loading={exporting}
          className="w-full md:w-auto"
        />
      </div>
    </div>
  );
}
