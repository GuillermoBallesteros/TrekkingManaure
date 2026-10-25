export function formatMoney(value: number): string {
  return `$${value.toLocaleString('es-CO')}`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${value}T12:00:00-05:00`));
}

export function todayInColombia(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const part = (type: string) => parts.find((item) => item.type === type)?.value;

  return `${part('year')}-${part('month')}-${part('day')}`;
}
