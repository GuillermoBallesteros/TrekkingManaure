export const evento = {
  nombre: 'Trekking Desafío Perijá 13K',
  lugar: 'Manaure, Cesar, Colombia',
  fechas: ['2026-11-15', '2026-11-16'],
  largada: '2026-11-15T04:00:00-05:00',
  horaSalidaTexto: '4:00 a.m.',
  distanciaKm: 13,
  encuentro: 'Restaurante El Sabor, Villa Adelaida',
  llegada: 'Páramo',
  // Último día para pagar saldos: 14 días antes del primer día del evento.
  fechaLimitePago: '2026-11-09',
  fechaAperturaInscripciones: '2026-10-28',
  fechasTexto: '15 y 16 de noviembre',
  plazoTexto: '9 de noviembre de 2026',
} as const;

// El HTML adjunto es la referencia para estos valores de la primera versión visual.
export const precios = {
  moneda: 'COP',
  total: 350000,
  inscripcion: 50000,
  kitCompleto: 300000,
  acompanante: 150000,
  cuatrimoto: 150000,
  parapente: 200000,
  /** Acompañante que también compra kit. */
  acompananteConKit: 350000,
  /** Hotel para llegar antes del evento: por noche y por persona. */
  hotelNoche: 45000,
} as const;

export const cupos = {
  iniciales: 60,
  ampliacion: 10,
  maximo: 70,
} as const;

export const contacto = {
  encargada: 'Sandra',
  whatsapp: '573137317910',
  whatsappConfigurado: true,
} as const;
