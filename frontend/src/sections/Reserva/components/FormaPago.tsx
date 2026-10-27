import Calendario from '../../../components/ui/Calendario';
import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';
import type { Cotizacion, PlanPago } from '../../../types/reserva';

type Props = {
  plan: PlanPago | null;
  onPlan: (value: PlanPago | null) => void;
  date: string;
  onDate: (value: string) => void;
  quote: Cotizacion;
};

export default function FormaPago({ plan, onPlan, date, onDate, quote }: Props) {
  const restante = quote.total - precios.inscripcion;
  const options = [
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
  ];

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">6</span>
        <div>
          <h3>Forma de pago</h3>
          <small>Elige cómo pagar el valor total de tu reserva.</small>
        </div>
      </div>
      <div className="choice-grid" role="radiogroup" aria-label="Forma de pago">
        {options.map((option) => (
          <label className="choice" key={option.value}>
            <input
              type="radio"
              name="formaPago"
              value={option.value}
              required
              checked={plan === option.value}
              onClick={() => {
                // Un clic sobre la opción ya marcada la desmarca.
                if (plan === option.value) onPlan(null);
              }}
              onChange={() => onPlan(option.value)}
            />
            <span className="choice__dot" />
            <span className="choice__text">
              <strong>{option.title}</strong>
              <small>{option.text}</small>
            </span>
          </label>
        ))}
      </div>
      {plan === 'apartado' && (
        <>
          <p className="field-hint calendar-hint">
            Elige el día en que pagarás el restante de {formatMoney(restante)}.
          </p>
          <Calendario selected={date} onSelect={onDate} concepto="el restante" />
        </>
      )}
    </div>
  );
}
