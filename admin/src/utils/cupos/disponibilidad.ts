// Disponibilidad sobre la capacidad vigente. La capacidad la define la organización
// (60 por defecto) y solo cambia cuando se ajusta desde el panel.
export function getAvailability(occupied: number, capacity: number) {
  const taken = Math.max(0, occupied);

  return {
    occupied: taken,
    capacity,
    available: Math.max(0, capacity - taken),
    percentage: capacity > 0 ? Math.min(100, (taken / capacity) * 100) : 0,
  };
}
