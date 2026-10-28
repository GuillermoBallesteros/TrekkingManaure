import { EDAD_MAXIMA } from '../../../../shared/reservas';

/** Nombre del campo de formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function fieldName(prefix: string, base: string): string {
  return prefix ? prefix + base.charAt(0).toUpperCase() + base.slice(1) : base;
}

/**
 * Rango de fechas de nacimiento según la fecha actual: desde hace EDAD_MAXIMA años hasta hoy.
 * Se calcula cada vez que se muestra el formulario, así no queda fijo en un año.
 */
export function fechasNacimientoPermitidas(hoy: string): { min: string; max: string } {
  const [year, month, day] = hoy.split('-').map(Number);
  const min = new Date(Date.UTC(year - EDAD_MAXIMA - 1, month - 1, day + 1));
  return { min: min.toISOString().slice(0, 10), max: hoy };
}

/** Convierte AAAA-MM-DD a DD/MM/AAAA para el resumen. */
export function formatBirth(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? match[3] + '/' + match[2] + '/' + match[1] : value;
}

/** Quita espacios de más: los nombres se guardan con un solo espacio entre palabras. */
export function limpiarTexto(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
