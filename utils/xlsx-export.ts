import * as XLSX from "xlsx";

/**
 * Builds a single-sheet workbook from headers + rows and triggers a browser
 * download. Client-side only (called from a click handler).
 */
export function downloadXlsx(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  sheetName: string = "Workqueue"
): void {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
