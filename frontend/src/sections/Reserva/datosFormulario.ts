import { evento } from '../../../../shared/config';

// Opciones del formulario de reserva. Editar aquí para cambiar los desplegables.
export const TIPOS_DOCUMENTO = ['CC', 'CE', 'TI', 'RC', 'Pasaporte', 'PPT'] as const;

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const EPS_CESAR = [
  'Nueva EPS',
  'Sura',
  'Sanitas',
  'Salud Total',
  'Compensar',
  'Famisanar',
  'Coosalud',
  'Mutual SER',
  'Emssanar',
  'Asmet Salud',
  'Dusakawi',
  'SOS',
  'Aliansalud',
] as const;

export const EPS_OTRA = 'Otra';

// Sin guiones ni paréntesis dentro de los patrones: con el flag v de Chrome
// una expresión inválida hace que el campo acepte cualquier valor.
export const PATRON_DOCUMENTO = '[A-Za-z0-9]{5,20}';
export const PATRON_TELEFONO = '[0-9 +]{7,20}';
export const PATRON_NOMBRE = '.*[^ ].*';

// Edad permitida el día del evento: de 1 a 99 años cumplidos.
export const EDAD_MIN = 1;
export const EDAD_MAX = 99;

function fechaNacimientoLimite(diaEvento: string, anios: number, dias = 0) {
  const [year, month, day] = diaEvento.split('-').map(Number);
  return new Date(Date.UTC(year - anios, month - 1, day + dias)).toISOString().slice(0, 10);
}

/** Nacimiento más reciente válido: quien cumple EDAD_MIN años el día del evento. */
export const NACIMIENTO_MAX = fechaNacimientoLimite(evento.fechas[0], EDAD_MIN);
/** Nacimiento más antiguo válido: quien no cumple EDAD_MAX + 1 años hasta después del evento. */
export const NACIMIENTO_MIN = fechaNacimientoLimite(evento.fechas[0], EDAD_MAX + 1, 1);
