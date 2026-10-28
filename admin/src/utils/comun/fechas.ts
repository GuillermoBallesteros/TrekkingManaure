import { plural } from './texto';

function toDate(value: string) {
  return new Date(value + 'T12:00:00Z');
}

export function daysBetween(from: string, to: string) {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86400000);
}

export function describeDeadline(days: number) {
  if (days < 0) return 'vencido hace ' + plural(-days, 'día', 'días');
  if (days === 0) return 'vence hoy';
  return (days === 1 ? 'falta ' : 'faltan ') + plural(days, 'día', 'días');
}

export function getAge(birthDate: string, today: string) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [currentYear, currentMonth, currentDay] = today.split('-').map(Number);
  const birthdayPassed = currentMonth > month || (currentMonth === month && currentDay >= day);

  return currentYear - year - (birthdayPassed ? 0 : 1);
}
