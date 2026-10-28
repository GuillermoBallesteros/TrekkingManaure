import { useOpcionesReserva } from '../../../hooks';
import type { Estadia, Extra } from '../../../types/reserva';

type Props = {
  stay: Estadia;
  onStay: (value: Estadia) => void;
  extras: Extra[];
  onExtras: (value: Extra) => void;
};

export default function OpcionesReserva(props: Props) {
  const view = useOpcionesReserva(props);

  return (
    <>
      <div className="form-block">
        <div className="form-block__head">
          <span className="form-block__n">3</span>
          <div>
            <h3>Opción de estadía</h3>
            <small>Elige dónde pasas la noche.</small>
          </div>
        </div>
        <div className="choice-grid" role="radiogroup" aria-label="Opción de estadía">
          {view.stays.map((option) => (
            <label className="choice" key={option.value}>
              <input type="radio" name="estadia" value={option.value} required {...option.input} />
              <span className="choice__dot" />
              <span className="choice__text">
                <strong>{option.title}</strong>
                <small>{option.text}</small>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-block">
        <div className="form-block__head">
          <span className="form-block__n">4</span>
          <div>
            <h3>Actividades extra</h3>
            <small>Opcionales. Incluyen merienda.</small>
          </div>
        </div>
        <div className="extra-choices">
          {view.extras.map((extra) => (
            <label className="mini-choice" key={extra.id}>
              <input type="checkbox" checked={extra.checked} onChange={extra.toggle} />
              <span className="mini-choice__text">
                <strong>{extra.title}</strong>
                <small>{extra.text}</small>
              </span>
              <span className="mini-choice__price">{extra.price}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
