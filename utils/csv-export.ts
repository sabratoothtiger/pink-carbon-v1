// Small helpers for building and downloading CSV files on the client.

/**
 * Strips HTML markup from rich-text fields (e.g. notes) for plain-text export.
 */
export function stripHtml(html: string): string {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Escapes a value for a single CSV field, quoting when it contains commas,
 * quotes, or newlines.
 */
export function csvEscape(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Joins headers and rows into a single CSV string (CRLF line endings).
 */
export function buildCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  return [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\r\n");
}

/**
 * Triggers a browser download of the given CSV content. Prepends a UTF-8 BOM
 * so Excel renders non-ASCII characters correctly.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
