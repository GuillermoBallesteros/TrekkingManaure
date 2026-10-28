import { precios } from '../../../../shared/config';
import { presets } from '../../../../shared/data/imagenes';
import { formatMoney } from '../../../../shared/utils/format';
import { actividadesExtra, hotelPrevio } from '../../data/extras/actividades';

export function useExtras() {
  return {
    actividades: actividadesExtra.map((extra) => ({
      ...extra,
      preset: presets.extra,
      price: formatMoney(precios[extra.precio]),
      chips: extra.chips.length > 0 ? extra.chips : null,
    })),
    hotel: {
      ...hotelPrevio,
      price: formatMoney(precios.hotelNoche),
      unidad: 'por noche y persona',
      ejemplo:
        'Con acompañante que también llega antes: ' +
        formatMoney(precios.hotelNoche * 2) +
        ' por noche.',
    },
  };
}
