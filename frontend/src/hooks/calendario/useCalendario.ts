import { evento } from '../../../../shared/config';
import { firstPaymentDay } from '../../../../shared/reservas';
import { formatDate, todayInColombia } from '../../../../shared/utils/format';
import { DIAS_SEMANA } from '../../data/calendario/dias';
import { buildMonths } from '../../utils/calendario/meses';
import { classNames } from '../../utils/comun/classNames';

type Options = {
  selected: string;
  onSelect: (value: string) => void;
  /** Texto accesible y del mensaje de selección, p. ej. 'el saldo del kit'. */
  concepto: string;
};

export function useCalendario({ selected, onSelect, concepto }: Options) {
  return {
    deadline: formatDate(evento.fechaLimitePago),
    weekdays: DIAS_SEMANA,
    months: buildMonths(firstPaymentDay(todayInColombia())).map((month) => ({
      key: month.key,
      label: month.label,
      ariaLabel: 'Calendario de ' + month.label,
      slots: month.slots,
      days: month.days.map(({ iso, day }) => ({
        iso,
        day,
        className: classNames('cal-day', selected === iso && 'is-selected'),
        pressed: selected === iso,
        ariaLabel: 'Pagar ' + concepto + ' el ' + formatDate(iso),
        select: () => onSelect(iso),
      })),
    })),
    selectedText: selected ? 'Pagarás ' + concepto + ' el ' + formatDate(selected) + '.' : null,
  };
}
