import Icon from '../../../../../shared/components/Icon';
import { evento } from '../../../../../shared/config';
import { formatDate, todayInColombia } from '../../../../../shared/utils/format';
import './Calendario.css';

type Props = {
  unlocked: boolean;
  selected: string;
  onSelect: (value: string) => void;
};

export default function Calendario({ unlocked, selected, onSelect }: Props) {
  const [year, month] = evento.fechaLimitePago.split('-').map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const today = todayInColombia();
  const monthLabel = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  return (
    <>
      <div className={'cal-wrap ' + (unlocked ? 'is-unlocked' : '')}>
        <div className="cal-head">
          <strong>{monthLabel}</strong>
          <small>Plazo hasta el {formatDate(evento.fechaLimitePago)}</small>
        </div>
        <div className="cal-grid" role="group" aria-label="Calendario de pago del saldo">
          {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SÁ'].map((day) => (
            <div className="cal-dow" key={day}>
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, index) => (
            <div className="cal-day is-empty" key={'empty-' + index} />
          ))}
          {Array.from({ length: days }, (_, index) => {
            const day = index + 1;
            const iso =
              year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
            const isEvent = (evento.fechas as readonly string[]).includes(iso);
            const disabled = !unlocked || iso < today || iso > evento.fechaLimitePago || isEvent;
            return (
              <button
                key={iso}
                type="button"
                className={
                  'cal-day ' +
                  (selected === iso ? 'is-selected ' : '') +
                  (isEvent ? 'is-event' : '')
                }
                disabled={disabled}
                aria-pressed={selected === iso}
                aria-label={
                  isEvent
                    ? formatDate(iso) + ', día del evento'
                    : 'Pagar el saldo el ' + formatDate(iso)
                }
                onClick={() => onSelect(iso)}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="cal-legend">
          <span>
            <i className="legend-payment" />
            Tu fecha de pago
          </span>
          <span>
            <i className="legend-event" />
            Días del evento
          </span>
          <span>
            <i className="legend-unavailable" />
            No disponible
          </span>
        </div>
        {!unlocked && (
          <div className="cal-lock">
            <Icon name="lock" />
            <p>Primero adjunta el comprobante de los $50.000 para elegir tu fecha de pago.</p>
          </div>
        )}
      </div>
      {selected && (
        <div className="selected-date is-visible" role="status">
          <Icon name="calendar" />
          <span>Pagarás el saldo el {formatDate(selected)}.</span>
        </div>
      )}
    </>
  );
}
