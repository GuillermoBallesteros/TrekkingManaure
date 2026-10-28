import { cupos } from '../../config';
import type { Registration } from '../tipos';
import { countRunners, holdsSpot } from './estado';

export type Availability = {
  occupied: number;
  capacity: number;
  available: number;
  percentage: number;
  soldOut: boolean;
};

/**
 * Disponibilidad sobre la capacidad vigente. Ocupa cupo cada corredor (titular y acompañante)
 * de una inscripción con algún pago aprobado. La capacidad la fija la organización desde el
 * panel (60 al inicio, hasta 70); no se amplía sola.
 */
export function getAvailability(registrations: Registration[], capacity: number): Availability {
  const occupied = countRunners(registrations.filter(holdsSpot));
  const available = Math.max(0, capacity - occupied);

  return {
    occupied,
    capacity,
    available,
    percentage: capacity > 0 ? Math.min(100, (occupied / capacity) * 100) : 0,
    soldOut: available === 0,
  };
}

/** Rango permitido al ajustar la capacidad: no menos que lo ocupado ni más que el máximo. */
export function capacityRange(occupied: number) {
  return { min: Math.max(1, occupied), max: Math.max(cupos.maximo, occupied) };
}
