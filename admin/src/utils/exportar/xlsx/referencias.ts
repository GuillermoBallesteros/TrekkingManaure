export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Columna 0 = A.
export function columnName(index: number): string {
  const letter = String.fromCharCode(65 + (index % 26));
  return index < 26 ? letter : columnName(Math.floor(index / 26) - 1) + letter;
}

// Fila y columna desde 0.
export function cellRef(row: number, column: number) {
  return columnName(column) + (row + 1);
}

export function rangeRef(row: number, column: number, lastRow: number, lastColumn: number) {
  return cellRef(row, column) + ':' + cellRef(lastRow, lastColumn);
}

export function absoluteRange(
  sheet: string,
  row: number,
  column: number,
  lastRow: number,
  lastColumn: number,
) {
  const start = '$' + columnName(column) + '$' + (row + 1);
  const end = '$' + columnName(lastColumn) + '$' + (lastRow + 1);
  return "'" + sheet.replace(/'/g, "''") + "'!" + start + ':' + end;
}

// Número de serie de Excel para una fecha ISO (AAAA-MM-DD).
export function excelDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return (Date.UTC(year, month - 1, day) - Date.UTC(1899, 11, 30)) / 86400000;
}
