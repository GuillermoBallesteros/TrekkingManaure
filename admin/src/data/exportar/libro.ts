import type { DxfDef, StyleDef } from '../../utils/exportar/xlsx/estilos';
import type { RegistrationStatus } from '../../../../shared/reservas';

export const hojas = {
  resumen: 'Resumen',
  buscar: 'Buscar',
  inscripciones: 'Inscripciones',
  pagos: 'Pagos',
  corredores: 'Corredores',
  tarifas: 'Tarifas',
} as const;

export const contenidoLibro = [
  {
    hoja: hojas.resumen,
    descripcion: 'Indicadores, 5 gráficos, ingresos por concepto, tallas y próximos cobros.',
  },
  { hoja: hojas.buscar, descripcion: 'Ficha completa al escribir un código o documento.' },
  {
    hoja: hojas.inscripciones,
    descripcion: 'Tabla con filtros, totales, estados y saldos calculados con fórmulas.',
  },
  {
    hoja: hojas.pagos,
    descripcion: 'Pagos por llave Bre-B; cambiar su revisión recalcula todo el libro.',
  },
  { hoja: hojas.corredores, descripcion: 'Una fila por corredor: estadía, kit, talla y salud.' },
  {
    hoja: hojas.tarifas,
    descripcion: 'Precios, fechas y capacidad editables que alimentan las fórmulas.',
  },
];

export const colores = {
  verde: '0B2E26',
  dorado: 'F2C14E',
  crema: 'F7F1DE',
  arena: 'FFF6D9',
  texto: '1F2A24',
  gris: '6B6250',
  naranja: 'E8581C',
  rojo: 'D3290F',
  musgo: '3E7A2B',
  tierra: 'A08C6A',
};

export const coloresEstado: Record<RegistrationStatus, string> = {
  'Por verificar': colores.dorado,
  'Saldo pendiente': colores.naranja,
  Vencido: colores.rojo,
  Pagado: colores.musgo,
  Rechazado: colores.tierra,
};

export const dxfEstado: Record<RegistrationStatus, string> = {
  'Por verificar': 'verificar',
  'Saldo pendiente': 'saldo',
  Vencido: 'vencido',
  Pagado: 'pagado',
  Rechazado: 'rechazado',
};

const moneda = '"$"#,##0';
const fecha = 'dd/mm/yyyy';
const DIAS = '0" días";[Red]"vencido "0" d";"hoy"';
const banda = { fill: colores.verde };
const tarjeta = { fill: colores.crema, border: 'tarjeta' as const };
const tarjetaTexto = { horizontal: 'left' as const, vertical: 'center' as const, indent: 1 };

export const estilosLibro: Record<string, StyleDef> = {
  banda,
  titulo: {
    ...banda,
    font: { bold: true, size: 20, color: colores.dorado },
    align: { vertical: 'center', indent: 1 },
  },
  subtitulo: {
    ...banda,
    font: { size: 10, color: 'FDF8DF' },
    align: { vertical: 'center', indent: 1 },
  },
  seccion: { font: { bold: true, size: 13, color: colores.verde }, border: 'inferior' },
  nota: {
    font: { italic: true, size: 9, color: colores.gris },
    align: { wrap: true, vertical: 'top' },
  },
  ayuda: {
    font: { italic: true, size: 9, color: colores.gris },
    align: { vertical: 'center', indent: 1 },
  },
  tablaEncabezado: {
    fill: colores.verde,
    font: { bold: true, color: 'FFFFFF' },
    align: { horizontal: 'center', vertical: 'center', wrap: true },
  },
  tablaTotal: { fill: 'EFE6C8', font: { bold: true }, border: 'superior' },
  moneda: { numFmt: moneda },
  monedaTotal: { numFmt: moneda, fill: 'EFE6C8', font: { bold: true }, border: 'superior' },
  entero: { numFmt: '0', align: { horizontal: 'center' } },
  enteroTotal: {
    numFmt: '0',
    fill: 'EFE6C8',
    font: { bold: true },
    border: 'superior',
    align: { horizontal: 'center' },
  },
  porcentaje: { numFmt: '0%', align: { horizontal: 'center' } },
  porcentajeTotal: {
    numFmt: '0%',
    fill: 'EFE6C8',
    font: { bold: true },
    border: 'superior',
    align: { horizontal: 'center' },
  },
  fecha: { numFmt: fecha, align: { horizontal: 'center' } },
  centro: { align: { horizontal: 'center' } },
  dias: {
    numFmt: DIAS,
    align: { horizontal: 'center' },
  },
  etiqueta: { border: 'fina', align: { indent: 1, vertical: 'center' } },
  celdaTexto: { border: 'fina', align: { indent: 1, vertical: 'center' } },
  celdaEntero: { border: 'fina', numFmt: '0', align: { horizontal: 'center' } },
  celdaMoneda: { border: 'fina', numFmt: moneda },
  celdaPorcentaje: { border: 'fina', numFmt: '0%', align: { horizontal: 'center' } },
  celdaFecha: { border: 'fina', numFmt: fecha, align: { horizontal: 'center' } },
  celdaDias: {
    border: 'fina',
    numFmt: DIAS,
    align: { horizontal: 'center' },
  },
  celdaCentro: { border: 'fina', align: { horizontal: 'center' } },
  kpiEtiqueta: {
    ...tarjeta,
    font: { bold: true, size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  kpiValor: {
    ...tarjeta,
    numFmt: '0',
    font: { bold: true, size: 22, color: colores.verde },
    align: tarjetaTexto,
  },
  kpiMoneda: {
    ...tarjeta,
    numFmt: moneda,
    font: { bold: true, size: 20, color: colores.verde },
    align: tarjetaTexto,
  },
  kpiMonedaAlerta: {
    ...tarjeta,
    numFmt: moneda,
    font: { bold: true, size: 20, color: colores.rojo },
    align: tarjetaTexto,
  },
  kpiValorAlerta: {
    ...tarjeta,
    numFmt: '0',
    font: { bold: true, size: 22, color: colores.rojo },
    align: tarjetaTexto,
  },
  notaCorredores: {
    ...tarjeta,
    numFmt: '[=1]0" corredor";0" corredores"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaPromedio: {
    ...tarjeta,
    numFmt: moneda + '" en promedio"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaPorcentaje: {
    ...tarjeta,
    numFmt: '0%" del facturado"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaConSaldo: {
    ...tarjeta,
    numFmt: '[=1]0" inscripción con saldo";0" inscripciones con saldo"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaInscripciones: {
    ...tarjeta,
    numFmt: '[=1]0" inscripción";0" inscripciones"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaDeclarados: {
    ...tarjeta,
    numFmt: moneda + '" declarados"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaOcupados: {
    ...tarjeta,
    numFmt: '[=1]0" cupo ocupado";0" cupos ocupados"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  notaRiesgo: {
    ...tarjeta,
    numFmt: '0" en riesgo por vencimiento"',
    font: { size: 9, color: colores.gris },
    align: tarjetaTexto,
  },
  entrada: {
    fill: colores.arena,
    border: 'entrada',
    font: { bold: true, size: 13, color: colores.verde },
    align: { indent: 1, vertical: 'center' },
  },
  mensaje: { font: { italic: true, color: colores.gris }, align: { indent: 1 } },
  fichaEtiqueta: {
    fill: colores.crema,
    border: 'fina',
    font: { color: colores.gris },
    align: { indent: 1, vertical: 'center' },
  },
  fichaValor: { border: 'fina', font: { bold: true }, align: { indent: 1, vertical: 'center' } },
  fichaMoneda: {
    border: 'fina',
    numFmt: moneda,
    font: { bold: true },
    align: { indent: 1, vertical: 'center' },
  },
  fichaFecha: {
    border: 'fina',
    numFmt: fecha,
    font: { bold: true },
    align: { indent: 1, vertical: 'center' },
  },
  fichaDias: {
    border: 'fina',
    numFmt: DIAS,
    font: { bold: true },
    align: { indent: 1, vertical: 'center' },
  },
  fichaEntero: {
    border: 'fina',
    numFmt: '0',
    font: { bold: true },
    align: { horizontal: 'left', indent: 1, vertical: 'center' },
  },
  parametro: { fill: colores.arena, border: 'entrada', numFmt: moneda, font: { bold: true } },
  parametroFecha: { fill: colores.arena, border: 'entrada', numFmt: fecha, font: { bold: true } },
  parametroEntero: { fill: colores.arena, border: 'entrada', numFmt: '0', font: { bold: true } },
};

export const dxfLibro: Record<string, DxfDef> = {
  pagado: { fill: 'C6EFCE', color: '006100', bold: true },
  saldo: { fill: 'FCE4D6', color: '9C4A06', bold: true },
  vencido: { fill: 'FFC7CE', color: '9C0006', bold: true },
  verificar: { fill: 'FFF2CC', color: '7F6000', bold: true },
  rechazado: { fill: 'EDEDED', color: '595959', bold: true },
  alerta: { fill: 'FDE9E7', color: '9C0006' },
  saldoTexto: { color: 'C65911', bold: true },
};
