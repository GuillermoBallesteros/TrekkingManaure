import { Calendario } from '../../../components';
import { useFormaPago } from '../../../hooks';
import type { Cotizacion, PlanPago } from '../../../types/reserva';

type Props = {
  plan: PlanPago | null;
  onPlan: (value: PlanPago | null) => void;
  date: string;
  onDate: (value: string) => void;
  quote: Cotizacion;
};

export default function FormaPago({ plan, onPlan, date, onDate, quote }: Props) {
  const view = useFormaPago({ plan, onPlan, quote });

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
        {view.options.map((option) => (
          <label className="choice" key={option.value}>
            <input type="radio" name="formaPago" value={option.value} required {...option.input} />
            <span className="choice__dot" />
            <span className="choice__text">
              <strong>{option.title}</strong>
              <small>{option.text}</small>
            </span>
          </label>
        ))}
      </div>
      {view.showCalendar && (
        <>
          <p className="field-hint calendar-hint">{view.calendarHint}</p>
          <Calendario selected={date} onSelect={onDate} concepto="el restante" />
        </>
      )}
    </div>
  );
}
