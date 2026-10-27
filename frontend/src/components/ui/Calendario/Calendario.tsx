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

const WEEKDAYS = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SÁ'];

/** Primer día que se puede elegir: hoy, o la apertura de inscripciones si todavía no llega. */
function firstSelectableDay(today: string): string {
  return today > evento.fechaAperturaInscripciones ? today : evento.fechaAperturaInscripciones;
}

/** Meses (año, mes) entre el primer día elegible y la fecha límite de pago, ambos inclusive. */
function monthsInRange(first: string): Array<[number, number]> {
  const [limitYear, limitMonth] = evento.fechaLimitePago.split('-').map(Number);
  let [year, month] = first.split('-').map(Number);
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

function isoDate(year: number, month: number, day: number): string {
  return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}

export default function Calendario({ selected, onSelect, concepto = 'el saldo' }: Props) {
  const first = firstSelectableDay(todayInColombia());

  return (
    <>
      <div className="cal-wrap is-unlocked">
        <div className="cal-head">
          <strong>Elige una fecha</strong>
          <small>Plazo hasta el {formatDate(evento.fechaLimitePago)}</small>
        </div>
        {monthsInRange(first).map(([year, month]) => {
          const monthLabel = new Intl.DateTimeFormat('es-CO', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(Date.UTC(year, month - 1, 1)));
          const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
          // Solo cuentan los días desde el primer elegible; en los demás meses, desde el día 1.
          const firstShown = isoDate(year, month, 1) < first ? Number(first.slice(8)) : 1;
          const weekdayOfFirst = new Date(Date.UTC(year, month - 1, firstShown)).getUTCDay();
          const days = [];

          for (let slot = 0; slot < weekdayOfFirst; slot += 1) {
            // Celda de alineación: ocupa su columna pero no se ve.
            days.push(<div className="cal-slot" key={'slot-' + slot} aria-hidden="true" />);
          }
          for (let day = firstShown; day <= daysInMonth; day += 1) {
            const iso = isoDate(year, month, day);
            if (iso > evento.fechaLimitePago) break;
            days.push(
              <button
                key={iso}
                type="button"
                className={'cal-day ' + (selected === iso ? 'is-selected' : '')}
                aria-pressed={selected === iso}
                aria-label={'Pagar ' + concepto + ' el ' + formatDate(iso)}
                onClick={() => onSelect(iso)}
              >
                {day}
              </button>,
            );
          }

          return (
            <div key={year + '-' + month}>
              <p className="cal-month">{monthLabel}</p>
              <div className="cal-grid" role="group" aria-label={'Calendario de ' + monthLabel}>
                {WEEKDAYS.map((day) => (
                  <div className="cal-dow" key={day}>
                    {day}
                  </div>
                ))}
                {days}
              </div>
            </div>
          );
        })}
        <div className="cal-legend">
          <span>
            <i className="legend-payment" />
            Tu fecha de pago
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
