import { formatDateTime } from '../../../../../shared/utils/format';
import { dxfEstado, hojas } from '../../../data/exportar/libro';
import {
  epsLabel,
  estadias,
  formatPhone,
  getRunners,
  tallas,
  type Runner,
} from '../../../../../shared/reservas';
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
  { name: 'Celular', width: 17, value: ({ runner }) => formatPhone(runner.person.phone) },
  { name: 'Correo', width: 24, value: ({ runner }) => runner.person.email },
  { name: 'Ciudad', width: 16, value: ({ runner }) => runner.city },
  { name: 'EPS', width: 18, value: ({ runner }) => epsLabel(runner.person.eps) },
  {
    name: 'Contacto de emergencia',
    width: 22,
    value: ({ runner }) => runner.person.emergencyContact.name,
  },
  {
    name: 'Parentesco',
    width: 16,
    value: ({ runner }) => runner.person.emergencyContact.relationship,
  },
  {
    name: 'Teléfono de emergencia',
    width: 17,
    value: ({ runner }) => formatPhone(runner.person.emergencyContact.phone),
  },
  { name: 'Estadía', width: 17, value: ({ runner }) => runner.stay },
  { name: 'Kit', width: 8, style: 'centro', value: ({ runner }) => siNo(runner.kit) },
  { name: 'Talla', width: 9, style: 'centro', value: ({ runner }) => runner.shirtSize ?? '' },
  { name: 'Enfermedad', width: 22, value: ({ runner }) => runner.health.illness ?? 'No' },
  { name: 'Alergias', width: 20, value: ({ runner }) => runner.health.allergies ?? 'No' },
  { name: 'Discapacidad', width: 20, value: ({ runner }) => runner.health.disability ?? 'No' },
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
      r('Discapacidad') +
      '<>"No")+(' +
      r('Practica deporte') +
      '="No")',
  },
  {
    name: 'Parapente',
    width: 11,
    style: 'centro',
    value: ({ runner }) => siNo(runner.paragliding),
  },
  {
    name: 'Áreas protegidas',
    width: 12,
    style: 'centro',
    value: ({ runner }) => siNo(runner.person.commitments.protectedAreas),
  },
  {
    name: 'Medio ambiente',
    width: 12,
    style: 'centro',
    value: ({ runner }) => siNo(runner.person.commitments.environment),
  },
  {
    name: 'Términos aceptados',
    width: 19,
    value: ({ runner }) =>
      runner.person.consent.acceptedAt ? formatDateTime(runner.person.consent.acceptedAt) : '',
  },
  {
    name: 'Uso de imagen',
    width: 11,
    style: 'centro',
    value: ({ runner }) => siNo(runner.person.consent.imageUse),
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
