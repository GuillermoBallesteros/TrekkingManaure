import { evento } from '../../../../shared/config';

type DiaCalendario = { iso: string; day: number };

type MesCalendario = {
  key: string;
  label: string;
  /** Celdas vacías antes del primer día para alinearlo con su día de la semana. */
  slots: string[];
  days: DiaCalendario[];
};

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

/** Un mes del calendario con sus días elegibles, desde `first` hasta la fecha límite de pago. */
function buildMonth(year: number, month: number, first: string): MesCalendario {
  const label = new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // Solo cuentan los días desde el primer elegible; en los demás meses, desde el día 1.
  const firstShown = isoDate(year, month, 1) < first ? Number(first.slice(8)) : 1;
  const weekdayOfFirst = new Date(Date.UTC(year, month - 1, firstShown)).getUTCDay();
  const days: DiaCalendario[] = [];

  for (let day = firstShown; day <= daysInMonth; day += 1) {
    const iso = isoDate(year, month, day);
    if (iso > evento.fechaLimitePago) break;
    days.push({ iso, day });
  }

  return {
    key: year + '-' + month,
    label,
    slots: Array.from({ length: weekdayOfFirst }, (_, slot) => 'slot-' + slot),
    days,
  };
}

/** Meses que muestra el calendario a partir del primer día elegible. */
export function buildMonths(first: string): MesCalendario[] {
  return monthsInRange(first).map(([year, month]) => buildMonth(year, month, first));
}
