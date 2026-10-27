import { evento } from '../../../../../shared/config';
import { hojas } from '../../../data/exportar/libro';
import { tarifas } from '../../../data/comun/tarifas';
import { encabezado, hojaConTitulo, nota, type LibroContexto } from './comun';
import { setRow } from '../xlsx/hoja';
import type { DefinedName } from '../xlsx/paquete';
import { excelDate } from '../xlsx/referencias';

type Parametro = {
  name: string;
  label: string;
  value?: number;
  formula?: string;
  style: string;
  help: string;
};

export function crearTarifas(contexto: LibroContexto) {
  const sheet = hojaConTitulo(
    hojas.tarifas,
    'Tarifas y parámetros del evento',
    'Las celdas amarillas son editables: al cambiarlas se recalcula todo el libro.',
    4,
    { tabColor: 'A08C6A' },
  );
  sheet.widths = { 0: 2, 1: 38, 2: 18, 3: 2, 4: 60 };

  const parametros: Parametro[] = [
    {
      name: 'PrecioTitular',
      label: 'Inscripción y kit del titular',
      value: tarifas.titular,
      style: 'parametro',
      help: 'El kit es obligatorio para el titular.',
    },
    {
      name: 'PrecioSeparacion',
      label: 'Separación del cupo',
      value: tarifas.separacion,
      style: 'parametro',
      help: 'Monto mínimo para apartar el cupo; el resto se paga en la fecha de compromiso.',
    },
    {
      name: 'PrecioAcompSinKit',
      label: 'Acompañante sin kit',
      value: tarifas.acompananteSinKit,
      style: 'parametro',
      help: 'Corre el recorrido sin camisa ni kit.',
    },
    {
      name: 'PrecioAcompConKit',
      label: 'Acompañante con kit',
      value: tarifas.acompananteConKit,
      style: 'parametro',
      help: 'Igual al valor del titular; se le pide talla.',
    },
    {
      name: 'PrecioCuatrimoto',
      label: 'Paseo en cuatrimoto',
      value: tarifas.cuatrimoto,
      style: 'parametro',
      help: 'Experiencia adicional opcional.',
    },
    {
      name: 'PrecioParapente',
      label: 'Vuelo en parapente',
      value: tarifas.parapente,
      style: 'parametro',
      help: 'Experiencia adicional opcional.',
    },
    {
      name: 'FechaEvento',
      label: 'Fecha del evento',
      value: excelDate(evento.fechas[0]),
      style: 'parametroFecha',
      help: 'Primer día del recorrido.',
    },
    {
      name: 'DiasLimiteSaldo',
      label: 'Días de anticipación para pagar el saldo',
      value: 14,
      style: 'parametroEntero',
      help: 'El calendario bloquea compromisos posteriores a esta fecha.',
    },
    {
      name: 'FechaLimiteSaldo',
      label: 'Fecha límite del saldo',
      formula: 'FechaEvento-DiasLimiteSaldo',
      style: 'calculado',
      help: 'Calculada: fecha del evento menos los días de anticipación.',
    },
    {
      name: 'Capacidad',
      label: 'Capacidad del evento',
      value: contexto.capacity,
      style: 'parametroEntero',
      help: 'Cupos disponibles para titulares y acompañantes con pago aprobado.',
    },
    {
      name: 'CapacidadMaxima',
      label: 'Capacidad máxima con ampliación',
      value: contexto.maxCapacity,
      style: 'parametroEntero',
      help: 'Tope si se habilita la ampliación de cupos.',
    },
  ];

  encabezado(sheet, 3, 1, ['Concepto', 'Valor']);
  setRow(sheet, 3, 4, [{ v: 'Para qué sirve', s: 'tablaEncabezado' }]);

  const names: DefinedName[] = parametros.map((parametro, index) => {
    const row = 4 + index;
    setRow(sheet, row, 1, [
      { v: parametro.label, s: 'etiqueta' },
      parametro.formula
        ? { f: parametro.formula, s: parametro.style }
        : { v: parametro.value, s: parametro.style },
    ]);
    setRow(sheet, row, 4, [{ v: parametro.help, s: 'ayuda' }]);
    sheet.heights[row] = 20;
    return { name: parametro.name, ref: "'" + hojas.tarifas + "'!$C$" + (row + 1) };
  });

  nota(
    sheet,
    5 + parametros.length,
    1,
    4,
    'Todo el libro usa estos nombres en sus fórmulas (por ejemplo PrecioTitular o Capacidad). Si cambia un precio, cambian los totales, saldos, estados e indicadores.',
  );

  return { sheet, names };
}
