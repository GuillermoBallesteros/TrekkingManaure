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
export const PATRON_TELEFONO = '[0-9 ]{7,15}';
export const PATRON_NOMBRE = '.*[^ ].*';
export const EDAD_MIN = 1;
export const EDAD_MAX = 99;
