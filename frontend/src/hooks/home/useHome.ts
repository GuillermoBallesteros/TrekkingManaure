import { useState } from 'react';
import type { Estadia } from '../../types/reserva';
import { useReveal } from '../comun/useReveal';

/** Estado compartido por Alojamiento y Reserva: la estadía elegida en cualquiera de las dos. */
export function useHome() {
  const [stay, setStay] = useState<Estadia>('');
  useReveal();

  return { stay, setStay };
}
