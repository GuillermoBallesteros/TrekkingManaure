import { useDisponibilidad } from '../../../../shared/reservas';

/** Tarjeta de cupos de la portada: cupos libres reales, al día con lo que aprueba el panel. */
export function useContadorCupos() {
  const { available, capacity, occupied, percentage, soldOut } = useDisponibilidad();

  return {
    available,
    capacity,
    occupied,
    barStyle: { width: percentage + '%' },
    status: soldOut ? 'Páramo agotado' : 'Cupo limitado',
    nota: soldOut
      ? 'Ya no hay cupos para dormir en el páramo. La inscripción sigue abierta con hotel en Manaure o regreso a casa.'
      : 'Cupos solo para quienes duermen en el páramo. Hotel y regreso a casa no ocupan cupo.',
  };
}
