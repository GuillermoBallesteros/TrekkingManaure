export function plural(count: number, singular: string, pluralForm: string) {
  return count + ' ' + (count === 1 ? singular : pluralForm);
}

export function padCount(count: number) {
  return String(count).padStart(2, '0');
}
