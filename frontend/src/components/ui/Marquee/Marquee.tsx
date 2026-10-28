import { useMarquesina } from '../../../hooks';
import './Marquee.css';

export default function Marquee() {
  const textos = useMarquesina();

  return (
    <div className="marquee-clip" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">
          {/* La lista va dos veces para que la cinta no tenga cortes. */}
          {textos.map((item) => (
            <span key={item.key}>{item.texto}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
