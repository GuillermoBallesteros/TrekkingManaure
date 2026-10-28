import { evento } from '../../config';
import type { PreEventHotel } from '../tipos';
import { addDays, daysBetween, firstPaymentDay } from './fechas';

/**
 * Fechas en que se puede reservar hotel para llegar antes del evento: desde hoy (o la apertura
 * de inscripciones) hasta la noche anterior al primer día. La salida máxima es ese primer día.
 */
export function hotelWindow(today: string) {
  const lastCheckOut = evento.fechas[0];
  const firstCheckIn = firstPaymentDay(today);
  const lastCheckIn = addDays(lastCheckOut, -1);

  return {
    firstCheckIn,
    lastCheckIn,
    firstCheckOut: addDays(firstCheckIn, 1),
    lastCheckOut,
    available: firstCheckIn <= lastCheckIn,
  };
}

export function countHotelNights(hotel: Pick<PreEventHotel, 'checkIn' | 'checkOut'>) {
  return Math.max(0, daysBetween(hotel.checkIn, hotel.checkOut));
}

/** Personas que llegan antes: el titular y, si viene, el acompañante. */
export function countHotelPeople(hotel: PreEventHotel, hasCompanion: boolean) {
  return hasCompanion && hotel.withCompanion ? 2 : 1;
}
