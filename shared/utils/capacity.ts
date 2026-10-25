import { cupos } from '../config';

export function getCapacity(confirmed: number, initial: number = cupos.iniciales) {
  const occupied = Math.max(0, Math.min(confirmed, cupos.maximo));
  const capacity = occupied >= cupos.iniciales ? cupos.maximo : initial;

  return {
    occupied,
    capacity,
    available: Math.max(0, capacity - occupied),
    percentage: Math.min(100, (occupied / capacity) * 100),
  };
}
