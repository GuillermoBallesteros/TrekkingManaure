import { textosMarquesina } from '../../../data/home/marquesina';
import './Marquee.css';

export default function Marquee() {
  return (
    <div className="marquee-clip" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">
          {/* La lista va dos veces para que la cinta no tenga cortes. */}
          {[...textosMarquesina, ...textosMarquesina].map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
