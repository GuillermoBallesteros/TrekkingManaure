import { precios } from '../../../../shared/config';
import { useDisponibilidad } from '../../../../shared/reservas';
import { formatMoney } from '../../../../shared/utils/format';

/** Sección "Así funciona el cupo", con la capacidad y ocupación vigentes. */
export function useCupos() {
  const inscripcion = formatMoney(precios.inscripcion);
  const { capacity, occupied, available, percentage } = useDisponibilidad();

  return {
    capacity,
    inscripcion,
    barStyle: { width: percentage + '%' },
    legend: available
      ? available + (available === 1 ? ' cupo libre' : ' cupos libres')
      : 'Cupos agotados',
    occupied,
    rules: [
      {
        title: 'Son ' + capacity + ' cupos',
        text:
          'La capacidad del evento es de ' +
          capacity +
          ' personas, para cuidar la ruta y la experiencia de todos.',
      },
      {
        title: 'Reservas con los ' + inscripcion,
        text: 'El cupo se ocupa cuando la organización verifica que llegó el pago de la inscripción.',
      },
      {
        title: 'Los cupos se descuentan al validar',
        text: 'A medida que la organización verifica cada pago, el cupo queda asegurado y la disponibilidad baja.',
      },
    ].map((rule, index) => ({ ...rule, n: index + 1 })),
  };
}
