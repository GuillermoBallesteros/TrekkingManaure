import type { ChangeEvent } from 'react';
import { precios } from '../../../../shared/config';
import {
  addDays,
  extraPrice,
  hotelCharge,
  hotelWindow,
  type PreEventHotel,
} from '../../../../shared/reservas';
import { formatMoney } from '../../../../shared/utils/format';
import { OPCIONES_ESTADIA, OPCIONES_EXTRA } from '../../data/reserva/opciones';
import { opcionDesmarcable } from '../../utils/comun/opcionDesmarcable';
import type { Estadia, Extra, HotelFormulario } from '../../types/reserva';

type Options = {
  stay: Estadia;
  onStay: (value: Estadia) => void;
  extras: Extra[];
  onExtras: (value: Extra) => void;
  companion: boolean;
  hotel: HotelFormulario;
  onHotel: (cambios: Partial<HotelFormulario>) => void;
  /** Hotel con fechas válidas para cotizar; null si falta algo. */
  hotelCotizable: PreEventHotel | null;
  today: string;
};

export function useOpcionesReserva({
  stay,
  onStay,
  extras,
  onExtras,
  companion,
  hotel,
  onHotel,
  hotelCotizable,
  today,
}: Options) {
  const ventana = hotelWindow(today);
  const cargo = hotelCharge({
    companion: companion ? { kit: false } : null,
    extras: [],
    preEventHotel: hotelCotizable,
  });
  const noche = formatMoney(precios.hotelNoche);

  return {
    stays: OPCIONES_ESTADIA.map((option) => ({
      ...option,
      input: opcionDesmarcable<Estadia>(stay, option.value, onStay, ''),
    })),
    // El parapente del acompañante solo aparece si hay acompañante.
    extras: OPCIONES_EXTRA.filter((extra) => companion || !extra.conAcompanante).map((extra) => ({
      ...extra,
      checked: extras.includes(extra.id),
      toggle: () => onExtras(extra.id),
      price: formatMoney(extraPrice(extra.id)),
    })),
    hotel: {
      disponible: ventana.available,
      activo: hotel.activo,
      alternar: (event: ChangeEvent<HTMLInputElement>) => onHotel({ activo: event.target.checked }),
      precio: noche,
      texto: companion
        ? noche +
          ' por noche y por persona: si tu acompañante también llega, son ' +
          formatMoney(precios.hotelNoche * 2) +
          ' por noche.'
        : noche + ' por noche y por persona.',
      llegada: {
        value: hotel.checkIn,
        min: ventana.firstCheckIn,
        max: ventana.lastCheckIn,
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          onHotel({ checkIn: event.target.value }),
      },
      salida: {
        value: hotel.checkOut,
        min: hotel.checkIn ? addDays(hotel.checkIn, 1) : ventana.firstCheckOut,
        max: ventana.lastCheckOut,
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          onHotel({ checkOut: event.target.value }),
      },
      conAcompanante: companion
        ? {
            checked: hotel.conAcompanante,
            onChange: (event: ChangeEvent<HTMLInputElement>) =>
              onHotel({ conAcompanante: event.target.checked }),
          }
        : null,
      calculo: cargo
        ? cargo.label.replace('Hotel antes del evento · ', '') + ' = ' + formatMoney(cargo.amount)
        : 'Elige la llegada y la salida para calcular el valor.',
    },
  };
}
