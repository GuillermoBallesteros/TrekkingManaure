import { evento } from '../../config';
import { MAYORIA_EDAD } from '../data/catalogos';

// Fechas AAAA-MM-DD de la reserva. Se comparan como texto y se calculan al mediodía UTC para
// que los cambios de horario no muevan el día.

function toDate(value: string) {
  return new Date(value + 'T12:00:00Z');
}

/** true si el texto es una fecha AAAA-MM-DD que existe en el calendario. */
export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = toDate(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(value: string, days: number) {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86400000);
}

export function getAge(birthDate: string, today: string) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [currentYear, currentMonth, currentDay] = today.split('-').map(Number);
  const birthdayPassed = currentMonth > month || (currentMonth === month && currentDay >= day);

  return currentYear - year - (birthdayPassed ? 0 : 1);
}

/** Menor de edad a la fecha indicada; una fecha inválida no cuenta como menor. */
export function isMinor(birthDate: string, today: string) {
  return isIsoDate(birthDate) && getAge(birthDate, today) < MAYORIA_EDAD;
}

/** Primer día elegible para pagar el restante: hoy, o la apertura si todavía no llega. */
export function firstPaymentDay(today: string) {
  return today > evento.fechaAperturaInscripciones ? today : evento.fechaAperturaInscripciones;
}
