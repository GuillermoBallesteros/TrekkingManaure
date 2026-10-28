import { paises } from '../data/catalogos';
import type { CountryCode, Phone } from '../tipos';

export type Pais = (typeof paises)[number];

/** 'movil' exige celular (WhatsApp); 'cualquiera' también acepta fijo. */
export type TipoTelefono = 'movil' | 'cualquiera';

/** Resultado de leer un indicativo escrito con + o 00. */
export type Deteccion =
  | { estado: 'detectado'; country: CountryCode; rest: string }
  | { estado: 'incompleto' }
  | { estado: 'desconocido' };

export function getCountry(iso: string): Pais | undefined {
  return paises.find((pais) => pais.iso === iso);
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

type Regla = { readonly largos: readonly number[]; readonly inicios: readonly string[] };

function cumple(regla: Regla | null, number: string) {
  return Boolean(
    regla &&
    regla.largos.includes(number.length) &&
    regla.inicios.some((inicio) => number.startsWith(inicio)),
  );
}

/**
 * Lee un número que empieza con + o 00 y elige el país por su indicativo. El +1 lo comparten
 * Estados Unidos y República Dominicana: se espera el código de área para decidir.
 */
export function detectCountry(value: string): Deteccion {
  const trimmed = value.trim();
  if (!trimmed.startsWith('+') && !trimmed.startsWith('00')) return { estado: 'desconocido' };

  const digits = digitsOnly(trimmed).replace(/^00/, '');
  const candidates = paises.filter((pais) => digits.startsWith(pais.indicativo));

  if (!candidates.length) {
    return paises.some((pais) => pais.indicativo.startsWith(digits))
      ? { estado: 'incompleto' }
      : { estado: 'desconocido' };
  }

  const longest = Math.max(...candidates.map((pais) => pais.indicativo.length));
  const best = candidates.filter((pais) => pais.indicativo.length === longest);
  const indicativo = best[0].indicativo;
  const rest = digits.slice(indicativo.length);

  if (best.length > 1) {
    if (rest.length < 3) return { estado: 'incompleto' };
    // Gana el país con el prefijo más largo que coincide: 809 (República Dominicana) antes que 8.
    const match = (pais: Pais) =>
      Math.max(
        0,
        ...pais.movil.inicios.filter((area) => rest.startsWith(area)).map((a) => a.length),
      );
    const winner = best.reduce((current, pais) => (match(pais) > match(current) ? pais : current));
    return { estado: 'detectado', country: winner.iso, rest };
  }

  return { estado: 'detectado', country: best[0].iso, rest };
}

/** Número nacional en dígitos; si alguien escribió el indicativo delante, se le quita. */
export function normalizeNumber(country: CountryCode, value: string) {
  const digits = digitsOnly(value);
  const pais = getCountry(country);
  if (!pais) return digits;

  const largos: readonly number[] = [...pais.movil.largos, ...(pais.fijo?.largos ?? [])];
  const sinIndicativo = digits.slice(pais.indicativo.length);
  return !largos.includes(digits.length) &&
    digits.startsWith(pais.indicativo) &&
    largos.includes(sinIndicativo.length)
    ? sinIndicativo
    : digits;
}

/** Primer problema del teléfono o null. `quien` completa el mensaje: 'del participante'. */
export function validatePhone(phone: Phone, tipo: TipoTelefono, quien: string): string | null {
  const pais = getCountry(phone.country);
  if (!pais) return 'Elige el país del teléfono ' + quien + '.';
  if (!/^\d+$/.test(phone.number)) return 'Escribe el teléfono ' + quien + ' solo con números.';

  const valido =
    cumple(pais.movil, phone.number) || (tipo === 'cualquiera' && cumple(pais.fijo, phone.number));
  if (valido) return null;

  return (
    (tipo === 'movil' ? 'El celular ' : 'El teléfono ') +
    quien +
    ' no es válido para ' +
    pais.nombre +
    ' (ejemplo: ' +
    pais.ejemplo +
    ').'
  );
}

/** Número completo comparable: +573001234567. */
export function phoneKey(phone: Phone) {
  const pais = getCountry(phone.country);
  return '+' + (pais?.indicativo ?? '') + phone.number;
}

/** Agrupa los dígitos como el ejemplo del país: +57 300 123 4567. */
export function formatPhone(phone: Phone) {
  const pais = getCountry(phone.country);
  if (!pais) return phone.number;

  const grupos = pais.ejemplo.split(' ').map((grupo) => grupo.length);
  const total = grupos.reduce((sum, largo) => sum + largo, 0);
  if (total !== phone.number.length) return '+' + pais.indicativo + ' ' + phone.number;

  let inicio = 0;
  const partes = grupos.map((largo) => {
    const parte = phone.number.slice(inicio, inicio + largo);
    inicio += largo;
    return parte;
  });
  return '+' + pais.indicativo + ' ' + partes.join(' ');
}
