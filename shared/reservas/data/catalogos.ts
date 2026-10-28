// Catálogos únicos de la reserva. El formulario público, el panel y la exportación leen de
// aquí, y el backend debe aceptar exactamente estos valores.

export const tiposDocumento = ['CC', 'CE', 'TI', 'RC', 'Pasaporte', 'PPT'] as const;

// Lista provisional: pendiente de confirmar con el cliente.
export const generos = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'] as const;

export const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const estadias = ['Páramo', 'Hotel en Manaure'] as const;

export const extras = ['cuatrimoto', 'parapente'] as const;

export const etiquetasExtra = {
  cuatrimoto: 'Paseo en cuatrimoto',
  parapente: 'Vuelo en parapente',
} as const;

/** 'total' paga todo al reservar; 'apartado' paga la inscripción y el resto en una fecha. */
export const planesPago = ['total', 'apartado'] as const;

export const etiquetasPlan = {
  total: 'Pago total',
  apartado: 'Aparta con la inscripción',
} as const;

// Única vía de pago. Se cambia aquí si la organización cambia de vía.
export const metodoPago = { value: 'llave-bre-b', label: 'Llave Bre-B' } as const;

// Sin guiones ni paréntesis dentro de los patrones: con el flag v de Chrome
// una expresión inválida hace que el campo acepte cualquier valor.
export const patrones = {
  documento: '[A-Za-z0-9]{5,20}',
  telefono: '[0-9 +]{7,20}',
  nombre: '.*[^ ].*',
} as const;
