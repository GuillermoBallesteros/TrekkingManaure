import { formatDateTime } from '../../../../../shared/utils/format';
import { dxfEstado, hojas } from '../../../data/exportar/libro';
import {
  ESTADIA_CON_CUPO,
  countHotelNights,
  countHotelPeople,
  epsLabel,
  estadias,
  etiquetasPlan,
  formatPhone,
  fullName,
  isMinor,
  generos,
  statusOrder,
  tallas,
  tiposDocumento,
} from '../../../../../shared/reservas';
import { addTable, tableColumnRange, thisRow } from '../xlsx/hoja';
import { columnName, excelDate } from '../xlsx/referencias';
import {
  filaTabla,
  filasDeTabla,
  hojaConTitulo,
  listaExcel,
  siNo,
  type Columna,
  type LibroContexto,
} from './comun';

const T = 'Inscripciones';
const r = (column: string) => thisRow(T, column);

const columnas: Columna[] = [
  { name: 'Código', width: 11, value: ({ registration }) => registration.id },
  {
    name: 'Registro',
    width: 12,
    style: 'fecha',
    value: ({ registration }) => excelDate(registration.createdAt),
  },
  { name: 'Nombres', width: 14, value: ({ registration }) => registration.firstName },
  { name: 'Apellidos', width: 18, value: ({ registration }) => registration.lastName },
  {
    name: 'Tipo de documento',
    width: 14,
    style: 'centro',
    value: ({ registration }) => registration.documentType,
  },
  { name: 'Documento', width: 13, value: ({ registration }) => registration.document },
  { name: 'Teléfono', width: 17, value: ({ registration }) => formatPhone(registration.phone) },
  { name: 'Correo', width: 24, value: ({ registration }) => registration.email },
  { name: 'Género', width: 11, value: ({ registration }) => registration.gender },
  { name: 'Ciudad', width: 16, value: ({ registration }) => registration.city },
  {
    name: 'Nacimiento',
    width: 12,
    style: 'fecha',
    value: ({ registration }) => excelDate(registration.birthDate),
  },
  {
    name: 'Edad',
    width: 9,
    style: 'entero',
    formula: 'INT(YEARFRAC(' + r('Nacimiento') + ',TODAY()))',
  },
  { name: 'Talla', width: 9, style: 'centro', value: ({ registration }) => registration.shirtSize },
  { name: 'EPS', width: 18, value: ({ registration }) => epsLabel(registration.eps) },
  {
    name: 'Contacto de emergencia',
    width: 22,
    value: ({ registration }) => registration.emergencyContact.name,
  },
  {
    name: 'Parentesco',
    width: 16,
    value: ({ registration }) => registration.emergencyContact.relationship,
  },
  {
    name: 'Teléfono de emergencia',
    width: 17,
    value: ({ registration }) => formatPhone(registration.emergencyContact.phone),
  },
  {
    name: 'Menor de edad',
    width: 11,
    style: 'centro',
    value: ({ registration }) => siNo(isMinor(registration.birthDate, registration.createdAt)),
  },
  {
    name: 'Autorización del responsable',
    width: 15,
    style: 'centro',
    value: ({ registration }) =>
      isMinor(registration.birthDate, registration.createdAt)
        ? siNo(registration.guardianAuthorized)
        : 'No aplica',
  },
  {
    name: 'Términos aceptados',
    width: 19,
    value: ({ registration }) =>
      registration.consent.acceptedAt ? formatDateTime(registration.consent.acceptedAt) : '',
  },
  {
    name: 'Versión de términos',
    width: 16,
    value: ({ registration }) => registration.consent.version,
  },
  {
    name: 'Uso de imagen',
    width: 11,
    style: 'centro',
    value: ({ registration }) => siNo(registration.consent.imageUse),
  },
  { name: 'Estadía', width: 17, value: ({ registration }) => registration.stay },
  {
    name: 'Acompañante',
    width: 15,
    style: 'centro',
    value: ({ registration }) => siNo(registration.companion !== null),
  },
  {
    name: 'Nombre del acompañante',
    width: 22,
    value: ({ registration }) => (registration.companion ? fullName(registration.companion) : ''),
  },
  {
    name: 'Estadía del acompañante',
    width: 17,
    value: ({ registration }) => registration.companion?.stay ?? '',
  },
  {
    name: 'Kit del acompañante',
    width: 15,
    style: 'centro',
    value: ({ registration }) => (registration.companion ? siNo(registration.companion.kit) : ''),
  },
  {
    name: 'Documento del acompañante',
    width: 20,
    value: ({ registration }) =>
      registration.companion
        ? registration.companion.documentType + ' ' + registration.companion.document
        : '',
  },
  {
    name: 'Teléfono del acompañante',
    width: 17,
    value: ({ registration }) =>
      registration.companion ? formatPhone(registration.companion.phone) : '',
  },
  {
    name: 'Correo del acompañante',
    width: 24,
    value: ({ registration }) => registration.companion?.email ?? '',
  },
  {
    name: 'Cuatrimoto',
    width: 13,
    style: 'centro',
    value: ({ registration }) => siNo(registration.extras.includes('cuatrimoto')),
  },
  {
    name: 'Parapente',
    width: 13,
    style: 'centro',
    value: ({ registration }) => siNo(registration.extras.includes('parapente')),
  },
  {
    name: 'Parapente del acompañante',
    width: 15,
    style: 'centro',
    value: ({ registration }) => siNo(registration.extras.includes('parapenteAcompanante')),
  },
  {
    name: 'Llegada al hotel',
    width: 12,
    style: 'fecha',
    value: ({ registration }) =>
      registration.preEventHotel ? excelDate(registration.preEventHotel.checkIn) : null,
  },
  {
    name: 'Salida del hotel',
    width: 12,
    style: 'fecha',
    value: ({ registration }) =>
      registration.preEventHotel ? excelDate(registration.preEventHotel.checkOut) : null,
  },
  {
    name: 'Noches de hotel',
    width: 10,
    style: 'entero',
    total: 'sum',
    value: ({ registration }) =>
      registration.preEventHotel ? countHotelNights(registration.preEventHotel) : 0,
  },
  {
    name: 'Personas en hotel',
    width: 10,
    style: 'entero',
    value: ({ registration }) =>
      registration.preEventHotel
        ? countHotelPeople(registration.preEventHotel, registration.companion !== null)
        : 0,
  },
  {
    name: 'Noches-persona de hotel',
    width: 12,
    style: 'entero',
    total: 'sum',
    formula: r('Noches de hotel') + '*' + r('Personas en hotel'),
  },
  { name: 'Plan', width: 22, value: ({ registration }) => etiquetasPlan[registration.plan] },
  {
    name: 'Compromiso',
    width: 12,
    style: 'fecha',
    value: ({ registration }) =>
      registration.commitmentDate ? excelDate(registration.commitmentDate) : null,
  },
  {
    name: 'Total',
    width: 13,
    style: 'moneda',
    total: 'sum',
    formula:
      'PrecioTitular+IF(' +
      r('Acompañante') +
      '="Sí",IF(' +
      r('Kit del acompañante') +
      '="Sí",PrecioAcompConKit,PrecioAcompSinKit),0)+IF(' +
      r('Cuatrimoto') +
      '="Sí",PrecioCuatrimoto,0)+IF(' +
      r('Parapente') +
      '="Sí",PrecioParapente,0)+IF(' +
      r('Parapente del acompañante') +
      '="Sí",PrecioParapente,0)+' +
      r('Noches-persona de hotel') +
      '*PrecioHotelNoche',
  },
  {
    name: 'Pagado',
    width: 13,
    style: 'moneda',
    total: 'sum',
    formula: 'SUMIFS(Pagos[Monto],Pagos[Código],' + r('Código') + ',Pagos[Revisión],"Aprobado")',
  },
  {
    name: 'Saldo',
    width: 13,
    style: 'moneda',
    total: 'sum',
    formula: 'MAX(0,' + r('Total') + '-' + r('Pagado') + ')',
  },
  {
    name: 'Por revisar',
    width: 13,
    style: 'moneda',
    total: 'sum',
    formula: 'SUMIFS(Pagos[Monto],Pagos[Código],' + r('Código') + ',Pagos[Revisión],"Por revisar")',
  },
  {
    name: 'Días al compromiso',
    width: 15,
    style: 'dias',
    formula:
      'IF(AND(' +
      r('Saldo') +
      '>0,ISNUMBER(' +
      r('Compromiso') +
      ')),' +
      r('Compromiso') +
      '-TODAY(),"")',
  },
  {
    name: 'Estado',
    width: 16,
    style: 'centro',
    formula:
      'IF(AND(' +
      r('Pagado') +
      '>0,' +
      r('Pagado') +
      '>=' +
      r('Total') +
      '),"Pagado",IF(' +
      r('Pagado') +
      '>0,IF(AND(ISNUMBER(' +
      r('Compromiso') +
      '),' +
      r('Compromiso') +
      '<TODAY()),"Vencido","Saldo pendiente"),IF(OR(COUNTIF(Pagos[Código],' +
      r('Código') +
      ')=0,COUNTIFS(Pagos[Código],' +
      r('Código') +
      ',Pagos[Revisión],"Por revisar")>0),"Por verificar","Rechazado")))',
  },
  {
    name: 'Personas',
    width: 12,
    style: 'entero',
    total: 'sum',
    formula: 'IF(' + r('Acompañante') + '="Sí",2,1)',
  },
  {
    // Solo quienes duermen en el páramo ocupan cupo.
    name: 'Personas en páramo',
    width: 12,
    style: 'entero',
    total: 'sum',
    formula:
      '(' +
      r('Estadía') +
      '="' +
      ESTADIA_CON_CUPO +
      '")+(' +
      r('Estadía del acompañante') +
      '="' +
      ESTADIA_CON_CUPO +
      '")',
  },
  {
    name: 'Alertas de salud',
    width: 12,
    style: 'entero',
    total: 'sum',
    formula: 'SUMIFS(Corredores[Alertas],Corredores[Código],' + r('Código') + ')',
  },
  {
    // Clave única para ordenar los cobros por fecha de compromiso en el Resumen.
    name: 'Clave de cobro',
    width: 10,
    hidden: true,
    formula:
      'IF(AND(' +
      r('Saldo') +
      '>0,' +
      r('Pagado') +
      '>0,ISNUMBER(' +
      r('Compromiso') +
      ')),' +
      r('Compromiso') +
      '+ROW()/100000,"")',
  },
];

const listas: Record<string, string> = {
  'Tipo de documento': listaExcel(tiposDocumento),
  Género: listaExcel(generos),
  Talla: listaExcel(tallas),
  Estadía: listaExcel(estadias),
  'Estadía del acompañante': listaExcel(estadias),
  Acompañante: '"Sí,No"',
  'Kit del acompañante': '"Sí,No"',
  Cuatrimoto: '"Sí,No"',
  Parapente: '"Sí,No"',
  'Parapente del acompañante': '"Sí,No"',
  'Menor de edad': '"Sí,No"',
  'Uso de imagen': '"Sí,No"',
  Plan: listaExcel(Object.values(etiquetasPlan)),
};

export function crearInscripciones(contexto: LibroContexto) {
  const sheet = hojaConTitulo(
    hojas.inscripciones,
    'Inscripciones',
    'Total, pagado, saldo y estado se calculan con fórmulas desde Pagos y Tarifas. Usa los filtros del encabezado; la fila Total suma solo lo visible.',
    columnas.length - 1,
    { tabColor: '0B2E26' },
  );
  sheet.freeze = { row: filaTabla + 1, column: 1 };

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
    filasDeTabla(columnas, contexto.summaries),
  );
  const table = sheet.tables[0];
  const first = filaTabla + 2;
  const letter = (name: string) => columnName(columnas.findIndex((col) => col.name === name));
  const range = (name: string) => tableColumnRange(table, name);

  for (const [name, list] of Object.entries(listas)) {
    sheet.validations.push({ range: range(name), list });
  }

  for (const status of statusOrder) {
    sheet.conditionals.push({
      range: range('Estado'),
      type: 'expression',
      formula: '$' + letter('Estado') + first + '="' + status + '"',
      dxf: dxfEstado[status],
    });
  }
  const days = '$' + letter('Días al compromiso') + first;
  sheet.conditionals.push(
    {
      range: range('Días al compromiso'),
      type: 'expression',
      formula: 'AND(ISNUMBER(' + days + '),' + days + '<0)',
      dxf: 'vencido',
    },
    {
      range: range('Días al compromiso'),
      type: 'expression',
      formula: 'AND(ISNUMBER(' + days + '),' + days + '<=3)',
      dxf: 'verificar',
    },
    {
      range: range('Saldo'),
      type: 'expression',
      formula: '$' + letter('Saldo') + first + '>0',
      dxf: 'saldoTexto',
    },
    {
      range: range('Alertas de salud'),
      type: 'expression',
      formula: '$' + letter('Alertas de salud') + first + '>0',
      dxf: 'alerta',
    },
    { range: range('Pagado'), type: 'dataBar', color: 'F2C14E' },
  );

  return { sheet, codes: range('Código') };
}
