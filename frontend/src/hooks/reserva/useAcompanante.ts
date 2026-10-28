import type { ChangeEvent } from 'react';
import { precios } from '../../../../shared/config';
import { formatMoney } from '../../../../shared/utils/format';
import { OPCIONES_ESTADIA } from '../../data/reserva/opciones';
import { opcionDesmarcable } from '../../utils/comun/opcionDesmarcable';

type Options = {
  companion: boolean;
  onCompanion: (value: boolean) => void;
  kit: boolean | null;
  onKit: (value: boolean | null) => void;
};

export function useAcompanante({ companion, onCompanion, kit, onKit }: Options) {
  const sinKit = formatMoney(precios.acompanante);
  const conKit = formatMoney(precios.acompananteConKit);

  return {
    companion,
    priceText: sinKit + ' sin kit · ' + conKit + ' con kit.',
    toggleCompanion: (event: ChangeEvent<HTMLInputElement>) => onCompanion(event.target.checked),
    kitOptions: [
      { value: false, title: 'No', text: 'Sin kit, no se pide talla.' },
      { value: true, title: 'Sí', text: 'Valor total ' + conKit + '.' },
    ].map((option) => ({
      ...option,
      input: opcionDesmarcable<boolean | null>(kit, option.value, onKit, null),
    })),
    // Los datos del acompañante salen cuando se responde si comprará kit.
    showPerson: kit !== null,
    withSize: kit === true,
    stays: OPCIONES_ESTADIA,
  };
}
