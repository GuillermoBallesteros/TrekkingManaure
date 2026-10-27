import { dxfEstado, hojas } from '../../../data/exportar/libro';
import type { Payment, Registration } from '../../../types/participante';
import { addTable, tableColumnRange, thisRow, type CellValue } from '../xlsx/hoja';
import { columnName, excelDate } from '../xlsx/referencias';
import { filaTabla, hojaConTitulo, type LibroContexto } from './comun';

const T = 'Pagos';
const r = (column: string) => thisRow(T, column);
const buscar = (column: string) =>
  'INDEX(Inscripciones[' + column + '],MATCH(' + r('Código') + ',Inscripciones[Código],0))';

type Fila = { registration: Registration; payment: Payment };

const columnas: {
  name: string;
  width: number;
  style?: string;
  total?: 'sum' | 'count';
  formula?: string;
  value?: (fila: Fila) => CellValue;
}[] = [
  { name: 'Pago', width: 10, value: ({ payment }) => payment.id },
  { name: 'Código', width: 11, value: ({ registration }) => registration.id },
  {
    name: 'Titular',
    width: 24,
    formula:
      'IFERROR(' + buscar('Nombres') + '&" "&' + buscar('Apellidos') + ',"Código no encontrado")',
  },
  { name: 'Concepto', width: 18, value: ({ payment }) => payment.concept },
  { name: 'Fecha', width: 12, style: 'fecha', value: ({ payment }) => excelDate(payment.date) },
  { name: 'Referencia Nequi', width: 16, value: ({ payment }) => payment.reference },
  {
    name: 'Monto',
    width: 14,
    style: 'moneda',
    total: 'sum',
    value: ({ payment }) => payment.amount,
  },
  { name: 'Revisión', width: 13, style: 'centro', value: ({ payment }) => payment.review },
  { name: 'Motivo del rechazo', width: 34, value: ({ payment }) => payment.rejectionReason ?? '' },
  {
    name: 'Estado de la inscripción',
    width: 18,
    style: 'centro',
    formula: 'IFERROR(' + buscar('Estado') + ',"")',
  },
];

export function crearPagos(contexto: LibroContexto) {
  const sheet = hojaConTitulo(
    hojas.pagos,
    'Pagos por Nequi',
    'Cambia la columna Revisión (Por revisar, Aprobado o Rechazado) y el saldo y estado de la inscripción se actualizan solos.',
    columnas.length - 1,
    { tabColor: 'E8581C' },
  );
  sheet.freeze = { row: filaTabla + 1, column: 2 };

  const filas: Fila[] = contexto.summaries
    .flatMap(({ registration }) =>
      registration.payments.map((payment) => ({ registration, payment })),
    )
    .sort((a, b) => a.payment.date.localeCompare(b.payment.date));

  addTable(
    sheet,
    {
      name: T,
      row: filaTabla,
      column: 0,
      columns: columnas,
      totals: true,
      style: 'TableStyleLight15',
    },
    filas.map((fila) => columnas.map((col) => col.value?.(fila) ?? null)),
  );
  const table = sheet.tables[0];
  const first = filaTabla + 2;
  const range = (name: string) => tableColumnRange(table, name);
  const letter = (name: string) => columnName(columnas.findIndex((col) => col.name === name));

  sheet.validations.push(
    { range: range('Revisión'), list: '"Por revisar,Aprobado,Rechazado"' },
    { range: range('Concepto'), list: '"Separación de cupo,Pago total,Pago de saldo"' },
    { range: range('Código'), list: 'ListaCodigos' },
  );

  const review = '$' + letter('Revisión') + first;
  sheet.conditionals.push(
    {
      range: range('Revisión'),
      type: 'expression',
      formula: review + '="Aprobado"',
      dxf: 'pagado',
    },
    {
      range: range('Revisión'),
      type: 'expression',
      formula: review + '="Por revisar"',
      dxf: 'verificar',
    },
    {
      range: range('Revisión'),
      type: 'expression',
      formula: review + '="Rechazado"',
      dxf: 'rechazado',
    },
    { range: range('Monto'), type: 'dataBar', color: 'E8581C' },
  );
  const status = '$' + letter('Estado de la inscripción') + first;
  for (const [name, dxf] of Object.entries(dxfEstado)) {
    sheet.conditionals.push({
      range: range('Estado de la inscripción'),
      type: 'expression',
      formula: status + '="' + name + '"',
      dxf,
    });
  }

  return { sheet };
}
