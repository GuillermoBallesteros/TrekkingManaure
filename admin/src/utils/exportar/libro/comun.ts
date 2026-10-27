import {
  createSheet,
  merge,
  setCell,
  type CellValue,
  type Sheet,
  type TableColumn,
} from '../xlsx/hoja';
import type { Summary } from '../../comun/inscripcion';

export type LibroContexto = {
  summaries: Summary[];
  today: string;
  capacity: number;
  filterLabel: string;
};

export type Columna = TableColumn & { value?: (summary: Summary) => CellValue };

// Fila (desde 0) donde empieza el encabezado de las tablas de datos.
export const filaTabla = 3;

export const siNo = (value: boolean) => (value ? 'Sí' : 'No');

export function hojaConTitulo(
  name: string,
  title: string,
  subtitle: string,
  lastColumn: number,
  options: { gridLines?: boolean; tabColor?: string } = {},
): Sheet {
  const sheet = createSheet(name, options);
  sheet.heights[0] = 34;
  sheet.heights[1] = 20;
  merge(sheet, 0, 0, 0, lastColumn, { v: title, s: 'titulo' });
  merge(sheet, 1, 0, 1, lastColumn, { v: subtitle, s: 'subtitulo' });
  return sheet;
}

export function seccion(
  sheet: Sheet,
  row: number,
  column: number,
  lastColumn: number,
  title: string,
) {
  merge(sheet, row, column, row, lastColumn, { v: title, s: 'seccion' });
  sheet.heights[row] = 22;
}

export function nota(sheet: Sheet, row: number, column: number, lastColumn: number, text: string) {
  merge(sheet, row, column, row, lastColumn, { v: text, s: 'nota' });
  sheet.heights[row] = 30;
}

export function filasDeTabla(columns: Columna[], summaries: Summary[]) {
  return summaries.map((summary) => columns.map((col) => col.value?.(summary) ?? null));
}

export function encabezado(sheet: Sheet, row: number, column: number, titles: string[]) {
  titles.forEach((title, index) =>
    setCell(sheet, row, column + index, { v: title, s: 'tablaEncabezado' }),
  );
}
