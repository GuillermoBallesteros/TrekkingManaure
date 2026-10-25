import { evento } from '../../../../../shared/config';
import './Marquee.css';

const items = [
  '60 cupos + 10',
  evento.fechasTexto,
  'Páramo o hotel',
  'Seguridad en ruta',
  'Hace frío: lleva abrigo',
  '13K',
];

export default function Marquee() {
  return (
    <div className="marquee-clip" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">
          {[...items, ...items].map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
