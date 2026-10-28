// Lo que hay que llevar por el frío del páramo.
export const abrigoNecesario = [
  'Abrigo',
  'Ropa térmica',
  'Impermeable',
  'Calzado de montaña',
  'Agua',
] as const;

// Medidas de seguridad del evento.
export const medidasSeguridad = [
  { icon: 'medical', title: 'Paramédicos', text: 'Acompañamiento durante todo el recorrido' },
  { icon: 'mountain', title: 'Guías locales', text: 'Conocen la ruta y el terreno' },
  { icon: 'droplet', title: 'Puntos de hidratación', text: 'Abastecimiento en la ruta' },
  {
    icon: 'shield',
    title: 'Apoyo de policía y fuerzas armadas',
    text: 'Seguridad en el recorrido',
  },
  { icon: 'check', title: 'Seguro médico', text: 'Cobertura del evento' },
  {
    icon: 'phone',
    title: 'Sin internet en el páramo',
    text: 'No hay conectividad: avisa a tu familia y descarga lo que necesites antes de subir',
  },
] as const;
