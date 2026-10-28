import { useDisponibilidad } from '../../../../shared/reservas';

/** Tarjeta de cupos de la portada: cupos libres reales, al día con lo que aprueba el panel. */
export function useContadorCupos() {
  const { available, capacity, occupied, percentage, soldOut } = useDisponibilidad();

  return {
    available,
    capacity,
    occupied,
    barStyle: { width: percentage + '%' },
    status: soldOut ? 'Cupos agotados' : 'Cupo limitado',
  };
}
