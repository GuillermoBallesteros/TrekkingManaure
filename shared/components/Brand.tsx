import { imagenes, presets } from '../data/imagenes';
import CloudImage from './CloudImage';

export default function Brand() {
  return (
    <span className="brand">
      <span className="brand__mark">
        <CloudImage publicId={imagenes.logo} preset={presets.logo} width={52} height={46} />
      </span>
      <span className="brand__text">
        <span className="brand__name">Trekking Perijá</span>
        <span className="brand__sub">Manaure · Cesar</span>
      </span>
    </span>
  );
}
