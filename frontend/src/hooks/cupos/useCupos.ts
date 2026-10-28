import { precios } from '../../../../shared/config';
import { useCierre, useDisponibilidad } from '../../../../shared/reservas';
import { formatMoney } from '../../../../shared/utils/format';

/** Sección "Así funciona el cupo", con la capacidad y ocupación vigentes. */
export function useCupos() {
  const inscripcion = formatMoney(precios.inscripcion);
  const { capacity, occupied, available, percentage } = useDisponibilidad();
  const { plazoTexto } = useCierre();

  return {
    capacity,
    inscripcion,
    barStyle: { width: percentage + '%' },
    legend: available
      ? available + (available === 1 ? ' cupo libre' : ' cupos libres')
      : 'Cupos del páramo agotados',
    occupied,
    plazo: plazoTexto,
    rules: [
      {
        title: capacity + ' cupos para dormir en el páramo',
        text: 'Los cupos son la capacidad del páramo: solo los ocupan quienes se quedan allá después del recorrido. Hotel en Manaure y regreso a casa no ocupan cupo.',
      },
      {
        title: 'Si se agotan, la inscripción sigue abierta',
        text:
          'Cuando se llenan los cupos del páramo, esa opción se deshabilita en la reserva, pero puedes inscribirte eligiendo hotel en Manaure o regreso a casa hasta el ' +
          plazoTexto +
          '.',
      },
      {
        title: 'Reservas con los ' + inscripcion,
        text: 'El cupo del páramo se ocupa cuando la organización verifica que llegó el pago de la inscripción.',
      },
    ].map((rule, index) => ({ ...rule, n: index + 1 })),
  };
}
