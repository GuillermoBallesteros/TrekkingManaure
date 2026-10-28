import { precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import { opcionDesmarcable } from '../../utils/comun/opcionDesmarcable';
import type { Cotizacion, PlanPago } from '../../types/reserva';

type Options = {
  plan: PlanPago | null;
  onPlan: (value: PlanPago | null) => void;
  quote: Cotizacion;
};

export function useFormaPago({ plan, onPlan, quote }: Options) {
  const restante = quote.total - precios.inscripcion;

  return {
    options: [
      {
        value: 'total' as const,
        title: 'Pagar todo ahora',
        text: 'Pagas ' + formatMoney(quote.total) + ' y tu reserva queda completa.',
      },
      {
        value: 'apartado' as const,
        title: 'Apartar mi cupo',
        text:
          'Pagas ' +
          formatMoney(precios.inscripcion) +
          ' ahora para apartar el cupo y eliges la fecha en que pagarás el restante.',
      },
    ].map((option) => ({
      ...option,
      input: opcionDesmarcable<PlanPago | null>(plan, option.value, onPlan, null),
    })),
    showCalendar: plan === 'apartado',
    calendarHint: 'Elige el día en que pagarás el restante de ' + formatMoney(restante) + '.',
  };
}
