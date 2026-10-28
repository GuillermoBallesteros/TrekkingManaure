import { precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';

/** Sección "Costos y pagos": valores del evento y pasos para pagar. */
export function useCostos() {
  const total = formatMoney(precios.total);
  const inscripcion = formatMoney(precios.inscripcion);
  const kit = formatMoney(precios.kitCompleto);

  return {
    total,
    inscripcion,
    kit,
    steps: [
      {
        title: 'Registra tus datos',
        text: 'Completa el formulario y registra tu reserva; recibes un código para seguirla.',
      },
      {
        title: 'Paga por llave Bre-B y elige tu fecha',
        text:
          'Paga ' +
          inscripcion +
          ' para apartar o ' +
          total +
          ' completo. Si apartas, eliges en el calendario el día en que pagarás los ' +
          kit +
          '.',
      },
      {
        title: 'Paga el saldo',
        text: 'Paga el dinero dentro del plazo. La organización valida los pagos y confirma tu cupo.',
      },
    ].map((step, index) => ({ ...step, n: String(index + 1).padStart(2, '0') })),
  };
}
