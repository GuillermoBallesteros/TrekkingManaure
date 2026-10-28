import type { CountryCode } from '../../../../shared/reservas';
import { BANDERA_TAMANO, BANDERAS_CDN } from '../../data/reserva/banderas';

/** Atributos de <img> para la bandera de un país desde flagcdn.com. */
export function bandera(iso: CountryCode) {
  const code = iso.toLowerCase();
  const { ancho, alto, x2, x3 } = BANDERA_TAMANO;
  const url = (size: string) => BANDERAS_CDN + '/' + size + '/' + code + '.png';

  return {
    src: url(ancho + 'x' + alto),
    srcSet: url(x2) + ' 2x, ' + url(x3) + ' 3x',
    width: ancho,
    height: alto,
  };
}
