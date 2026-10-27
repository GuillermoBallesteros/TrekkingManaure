import type { MetodoPago } from '../../types/reserva';

// Opciones del formulario de reserva. Editar aquí para cambiar los desplegables.
export const TIPOS_DOCUMENTO = ['CC', 'CE', 'TI', 'RC', 'Pasaporte', 'PPT'] as const;

// Lista provisional: pendiente de confirmar con el cliente.
export const GENEROS = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'] as const;

// Método de pago que muestra el resumen. Se cambia aquí si la organización cambia de vía.
export const METODO_PAGO: { value: MetodoPago; label: string } = {
  value: 'llave-bre-b',
  label: 'Llave Bre-B',
};

export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

// Sin guiones ni paréntesis dentro de los patrones: con el flag v de Chrome
// una expresión inválida hace que el campo acepte cualquier valor.
export const PATRON_DOCUMENTO = '[A-Za-z0-9]{5,20}';
export const PATRON_TELEFONO = '[0-9 +]{7,20}';
export const PATRON_NOMBRE = '.*[^ ].*';

// Edad máxima aceptada en el formulario.
const EDAD_MAX = 99;

/**
 * Rango de fechas de nacimiento según la fecha actual: desde hace EDAD_MAX años hasta hoy.
 * Se calcula cada vez que se muestra el formulario, así no queda fijo en un año.
 */
export function fechasNacimientoPermitidas(hoy: string): { min: string; max: string } {
  const [year, month, day] = hoy.split('-').map(Number);
  const min = new Date(Date.UTC(year - EDAD_MAX - 1, month - 1, day + 1));
  return { min: min.toISOString().slice(0, 10), max: hoy };
}
