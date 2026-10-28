import { dxfEstado, hojas } from '../../../data/exportar/libro';
import { estadias, getRunners, tallas, type Runner } from '../../../../../shared/reservas';
import { addTable, tableColumnRange, thisRow, type CellValue } from '../xlsx/hoja';
import { columnName, rangeRef } from '../xlsx/referencias';
import { filaTabla, hojaConTitulo, listaExcel, siNo, type LibroContexto } from './comun';

const T = 'Corredores';
const r = (column: string) => thisRow(T, column);
const buscar = (column: string) =>
  'INDEX(Inscripciones[' + column + '],MATCH(' + r('Código') + ',Inscripciones[Código],0))';

type Fila = { code: string; runner: Runner };

const columnas: {
  name: string;
  width: number;
  style?: string;
  total?: 'sum' | 'count';
  formula?: string;
  value?: (fila: Fila) => CellValue;
}[] = [
  { name: 'Código', width: 11, value: ({ code }) => code },
  { name: 'Rol', width: 13, value: ({ runner }) => runner.role },
  { name: 'Nombre', width: 24, value: ({ runner }) => runner.name },
  { name: 'Documento', width: 20, value: ({ runner }) => runner.document },
  { name: 'Ciudad', width: 16, value: ({ runner }) => runner.city },
  { name: 'Estadía', width: 17, value: ({ runner }) => runner.stay },
  { name: 'Kit', width: 8, style: 'centro', value: ({ runner }) => siNo(runner.kit) },
  { name: 'Talla', width: 9, style: 'centro', value: ({ runner }) => runner.shirtSize ?? '' },
  { name: 'Enfermedad', width: 22, value: ({ runner }) => runner.health.illness ?? 'No' },
  { name: 'Alergias', width: 20, value: ({ runner }) => runner.health.allergies ?? 'No' },
  {
    name: 'Practica deporte',
    width: 14,
    style: 'centro',
    value: ({ runner }) => siNo(runner.health.exercises),
  },
  {
    name: 'Alertas',
    width: 11,
    style: 'entero',
    total: 'sum',
    formula:
      '(' +
      r('Enfermedad') +
      '<>"No")+(' +
      r('Alergias') +
      '<>"No")+(' +
      r('Practica deporte') +
      '="No")',
  },
  {
    name: 'Cupo asegurado',
    width: 15,
    style: 'centro',
    formula: 'IF(IFERROR(' + buscar('Pagado') + ',0)>0,"Sí","No")',
  },
  { name: 'Estado', width: 16, style: 'centro', formula: 'IFERROR(' + buscar('Estado') + ',"")' },
];

export function crearCorredores(contexto: LibroContexto) {
  const sheet = hojaConTitulo(
    hojas.corredores,
    'Corredores',
    'Una fila por persona que corre. Las filas rojas tienen alertas de salud; la talla solo aparece si compró kit.',
    columnas.length - 1,
    { tabColor: '3E7A2B' },
  );
  sheet.freeze = { row: filaTabla + 1, column: 3 };

  const filas: Fila[] = contexto.summaries.flatMap(({ registration }) =>
    getRunners(registration).map((runner) => ({ code: registration.id, runner })),
  );

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
  const allRows = rangeRef(first - 1, 0, filaTabla + table.rowCount, columnas.length - 1);

  sheet.validations.push(
    { range: range('Kit'), list: '"Sí,No"' },
    { range: range('Talla'), list: listaExcel(tallas) },
    { range: range('Estadía'), list: listaExcel(estadias) },
    { range: range('Practica deporte'), list: '"Sí,No"' },
  );
  for (const [name, dxf] of Object.entries(dxfEstado)) {
    sheet.conditionals.push({
      range: range('Estado'),
      type: 'expression',
      formula: '$' + letter('Estado') + first + '="' + name + '"',
      dxf,
    });
  }
  sheet.conditionals.push(
    {
      range: range('Cupo asegurado'),
      type: 'expression',
      formula: '$' + letter('Cupo asegurado') + first + '="No"',
      dxf: 'verificar',
    },
    {
      range: allRows,
      type: 'expression',
      formula: '$' + letter('Alertas') + first + '>0',
      dxf: 'alerta',
    },
  );

  return { sheet };
}
