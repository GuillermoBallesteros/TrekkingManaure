import { precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import { OPCIONES_ESTADIA, OPCIONES_EXTRA } from '../../data/reserva/opciones';
import { opcionDesmarcable } from '../../utils/comun/opcionDesmarcable';
import type { Estadia, Extra } from '../../types/reserva';

type Options = {
  stay: Estadia;
  onStay: (value: Estadia) => void;
  extras: Extra[];
  onExtras: (value: Extra) => void;
};

export function useOpcionesReserva({ stay, onStay, extras, onExtras }: Options) {
  return {
    stays: OPCIONES_ESTADIA.map((option) => ({
      ...option,
      input: opcionDesmarcable<Estadia>(stay, option.value, onStay, ''),
    })),
    extras: OPCIONES_EXTRA.map((extra) => ({
      ...extra,
      checked: extras.includes(extra.id),
      toggle: () => onExtras(extra.id),
      price: formatMoney(precios[extra.id]),
    })),
  };
}
