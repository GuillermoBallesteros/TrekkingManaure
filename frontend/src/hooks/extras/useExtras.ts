import { precios } from '../../../../shared/config';
import { presets } from '../../../../shared/data/imagenes';
import { formatMoney } from '../../../../shared/utils/format';
import { actividadesExtra } from '../../data/extras/actividades';

export function useExtras() {
  return actividadesExtra.map((extra) => ({
    ...extra,
    preset: presets.extra,
    price: formatMoney(precios[extra.precio]),
    chips: extra.chips.length > 0 ? extra.chips : null,
  }));
}
