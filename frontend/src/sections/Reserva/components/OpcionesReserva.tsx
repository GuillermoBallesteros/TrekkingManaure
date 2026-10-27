import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';
import type { Estadia, Extra } from '../../../types/reserva';

type Props = {
  stay: Estadia;
  onStay: (value: Estadia) => void;
  extras: Extra[];
  onExtras: (value: Extra) => void;
};

export default function OpcionesReserva({ stay, onStay, extras, onExtras }: Props) {
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
          {[
            {
              value: 'Páramo' as const,
              title: 'Quedarse en el páramo',
              text: 'Fogata, camping o habitación rural y experiencia completa.',
            },
            {
              value: 'Hotel en Manaure' as const,
              title: 'Hotel en Manaure',
              text: 'Subes al páramo, cumples el recorrido y regresas a dormir.',
            },
          ].map((option) => (
            <label className="choice" key={option.value}>
              <input
                type="radio"
                name="estadia"
                value={option.value}
                required
                checked={stay === option.value}
                onChange={() => onStay(option.value)}
              />
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
          {[
            {
              id: 'cuatrimoto' as const,
              title: 'Cuatrimoto',
              text: 'Por pareja · merienda incluida',
            },
            {
              id: 'parapente' as const,
              title: 'Parapente',
              text: 'Por persona · merienda incluida',
            },
          ].map((extra) => (
            <label className="mini-choice" key={extra.id}>
              <input
                type="checkbox"
                checked={extras.includes(extra.id)}
                onChange={() => onExtras(extra.id)}
              />
              <span className="mini-choice__text">
                <strong>{extra.title}</strong>
                <small>{extra.text}</small>
              </span>
              <span className="mini-choice__price">{formatMoney(precios[extra.id])}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
