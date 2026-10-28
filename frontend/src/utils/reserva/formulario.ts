import { EDAD_MAX } from '../../data/reserva/formulario';
import type { DatosPersona } from '../../types/reserva';

/** Nombre del campo de formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function fieldName(prefix: string, base: string): string {
  return prefix ? prefix + base.charAt(0).toUpperCase() + base.slice(1) : base;
}

/**
 * Rango de fechas de nacimiento según la fecha actual: desde hace EDAD_MAX años hasta hoy.
 * Se calcula cada vez que se muestra el formulario, así no queda fijo en un año.
 */
export function fechasNacimientoPermitidas(hoy: string): { min: string; max: string } {
  const [year, month, day] = hoy.split('-').map(Number);
  const min = new Date(Date.UTC(year - EDAD_MAX - 1, month - 1, day + 1));
  return { min: min.toISOString().slice(0, 10), max: hoy };
}

/** Lee los campos de una persona del formulario; prefijo '' = titular, 'acomp' = acompañante. */
export function readPerson(data: FormData, prefix = '', withSize = false): DatosPersona {
  const read = (base: string) => String(data.get(fieldName(prefix, base)) || '').trim();
  const text = (base: string) => read(base) || 'No indicado';
  const yesNo = (base: string) => {
    const answer = read(base);
    if (answer === 'Sí') return read(base + 'Cual') ? 'Sí: ' + read(base + 'Cual') : 'Sí';
    return answer || 'No indicado';
  };
  return {
    nombre: (text('nombres') + ' ' + text('apellidos')).trim(),
    tipoDocumento: text('tipoDocumento'),
    documento: text('documento'),
    nacimiento: text('nacimiento'),
    genero: text('genero'),
    ...(prefix ? {} : { telefono: text('telefono'), correo: text('correo') }),
    ciudad: text('ciudad'),
    salud: {
      enfermedad: yesNo('enfermedad'),
      alergia: yesNo('alergia'),
      deporte: text('deporte'),
    },
    ...(withSize ? { talla: text('talla') } : {}),
  };
}
