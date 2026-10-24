// Datos del evento y reglas de reserva; sin flujo implementado.
export const evento = {
  nombre: 'Trekking Desafío Perijá 13K', lugar: 'Manaure, Cesar, Colombia',
  fechas: ['2026-11-15', '2026-11-16'], largada: '2026-11-15T06:00:00-05:00', distanciaKm: 13,
  encuentro: 'Restaurante El Sabor, Villa Adelaida', llegada: 'Páramo',
  fechaLimitePago: '2026-11-09', fechaAperturaInscripciones: null,
  calendario: { trasPagarInscripcion: true, maximo: 'fechaLimitePago' },
  estadias: ['Páramo: fogata, camping/habitación rural', 'Hotel en Manaure'],
  formulario: ['Datos personales y cédula (lista por confirmar)', 'Estadía', 'Comprobante de inscripción', 'Fecha de pago'],
  datosAcompanante: 'Por confirmar', advertencia: 'Hace frío en el páramo; preparar abrigo y equipaje adecuado.',
  seguridad: ['Paramédicos', 'Guías locales', 'Puntos de hidratación', 'Apoyo de policía y fuerzas armadas', 'Seguro médico'],
} as const;
