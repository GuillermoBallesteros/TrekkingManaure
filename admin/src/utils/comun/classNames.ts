export function classNames(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
