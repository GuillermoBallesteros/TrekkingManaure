import Icon from '../../../../../shared/components/Icon';
import { evento } from '../../../../../shared/config';
import { formatDate, todayInColombia } from '../../../../../shared/utils/format';
import './Calendario.css';

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  /** Texto accesible y del mensaje de selección, p. ej. 'el saldo del kit'. */
  concepto?: string;
};

/** Meses (año, mes) desde hoy hasta la fecha límite de pago, ambos inclusive. */
function monthsUntilLimit(today: string): Array<[number, number]> {
  const [limitYear, limitMonth] = evento.fechaLimitePago.split('-').map(Number);
  let [year, month] = (today < evento.fechaLimitePago ? today : evento.fechaLimitePago)
    .split('-')
    .map(Number);
  const months: Array<[number, number]> = [];
  while (year < limitYear || (year === limitYear && month <= limitMonth)) {
    months.push([year, month]);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

export default function Calendario({ selected, onSelect, concepto = 'el saldo' }: Props) {
  const today = todayInColombia();

  return (
    <>
      <div className="cal-wrap is-unlocked">
        <div className="cal-head">
          <strong>Elige una fecha</strong>
          <small>Plazo hasta el {formatDate(evento.fechaLimitePago)}</small>
        </div>
        {monthsUntilLimit(today).map(([year, month]) => {
          const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
          const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
          const monthLabel = new Intl.DateTimeFormat('es-CO', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(Date.UTC(year, month - 1, 1)));

          return (
            <div key={year + '-' + month}>
              <p className="cal-month">{monthLabel}</p>
              <div className="cal-grid" role="group" aria-label={'Calendario de ' + monthLabel}>
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
                    year +
                    '-' +
                    String(month).padStart(2, '0') +
                    '-' +
                    String(day).padStart(2, '0');
                  const disabled = iso < today || iso > evento.fechaLimitePago;
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={'cal-day ' + (selected === iso ? 'is-selected' : '')}
                      disabled={disabled}
                      aria-pressed={selected === iso}
                      aria-label={'Pagar ' + concepto + ' el ' + formatDate(iso)}
                      onClick={() => onSelect(iso)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="cal-legend">
          <span>
            <i className="legend-payment" />
            Tu fecha de pago
          </span>
          <span>
            <i className="legend-unavailable" />
            No disponible
          </span>
        </div>
      </div>
      {selected && (
        <div className="selected-date is-visible" role="status">
          <Icon name="calendar" />
          <span>
            Pagarás {concepto} el {formatDate(selected)}.
          </span>
        </div>
      )}
    </>
  );
}
