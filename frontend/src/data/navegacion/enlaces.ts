// Enlaces internos del sitio. Cada id es el ancla de una sección.
export const navLinks = [
  { id: 'evento', label: 'Evento' },
  { id: 'incluye', label: 'Incluye' },
  { id: 'costos', label: 'Costos' },
  { id: 'estadia', label: 'Estadía' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'galeria', label: 'Galería' },
  { id: 'aliados', label: 'Aliados' },
] as const;

export const footerEventLinks = [
  { id: 'evento', label: 'La experiencia' },
  { id: 'incluye', label: 'Qué incluye' },
  { id: 'costos', label: 'Costos y pagos' },
  { id: 'estadia', label: 'Estadía' },
  { id: 'galeria', label: 'Galería del evento' },
] as const;

export const footerJoinLinks = [
  { id: 'cupos', label: 'Cupos' },
  { id: 'reserva', label: 'Reservar cupo' },
  { id: 'seguridad', label: 'Seguridad y preparación' },
  { id: 'aliados', label: 'Aliados' },
] as const;
