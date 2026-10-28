import { formatDate, formatMoney } from '../../../../shared/utils/format';
import type { Cotizacion, Estadia } from '../../types/reserva';

type Options = {
  stay: Estadia;
  planDate: string;
  quote: Cotizacion;
};

/** Resumen lateral de la reserva; las filas opcionales son null cuando no aplican. */
export function useResumenReserva({ stay, planDate, quote }: Options) {
  return {
    titular: formatMoney(quote.titular),
    acompanante: quote.acompanante > 0 ? formatMoney(quote.acompanante) : null,
    extras: quote.extras > 0 ? formatMoney(quote.extras) : null,
    stay: stay || 'Por elegir',
    ahora: formatMoney(quote.ahora),
    saldo:
      quote.saldo > 0
        ? {
            label: 'Restante · ' + (planDate ? formatDate(planDate) : 'fecha por elegir'),
            amount: formatMoney(quote.saldo),
          }
        : null,
    total: formatMoney(quote.total),
    focusForm: () => document.getElementById('nombres')?.focus(),
  };
}
