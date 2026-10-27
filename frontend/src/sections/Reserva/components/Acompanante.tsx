import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';
import CamposPersona from './CamposPersona';
import FichaSalud from './FichaSalud';

type Props = {
  companion: boolean;
  onCompanion: (value: boolean) => void;
  kit: boolean | null;
  onKit: (value: boolean | null) => void;
};

export default function Acompanante({ companion, onCompanion, kit, onKit }: Props) {
  const kitOptions = [
    { value: false, title: 'No', text: 'Sin kit, no se pide talla.' },
    {
      value: true,
      title: 'Sí',
      text: 'Valor total ' + formatMoney(precios.acompananteConKit) + '.',
    },
  ];

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">5</span>
        <div>
          <h3>Acompañante</h3>
          <small>Opcional. Máximo un acompañante por participante.</small>
        </div>
      </div>
      <div className="toggle-line companion-toggle">
        <div className="toggle-line__text">
          <strong>Llevo acompañante</strong>
          <small>
            {formatMoney(precios.acompanante)} sin kit · {formatMoney(precios.acompananteConKit)}{' '}
            con kit.
          </small>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            aria-label="Llevo acompañante"
            checked={companion}
            onChange={(event) => onCompanion(event.target.checked)}
          />
          <span className="switch__track" />
        </label>
      </div>
      {companion && (
        <div className="fields companion-fields is-open">
          <div className="field field--full">
            <span className="field__label" id="acompKit-label">
              ¿El acompañante comprará kit? <span className="req">*</span>
            </span>
            <div className="choice-grid" role="radiogroup" aria-labelledby="acompKit-label">
              {kitOptions.map((option) => (
                <label className="choice" key={option.title}>
                  <input
                    type="radio"
                    name="acompKit"
                    value={option.title}
                    required
                    checked={kit === option.value}
                    onClick={() => {
                      // Un clic sobre la opción ya marcada la desmarca.
                      if (kit === option.value) onKit(null);
                    }}
                    onChange={() => onKit(option.value)}
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
          {/* Los datos del acompañante salen cuando se responde si comprará kit. */}
          {kit !== null && (
            <>
              <CamposPersona prefijo="acomp" sufijo=" del acompañante" conTalla={kit} />
              <FichaSalud prefijo="acomp" />
              <div className="field field--full">
                <label htmlFor="acompEstadia">
                  Estadía del acompañante <span className="req">*</span>
                </label>
                <select id="acompEstadia" name="acompEstadia" required defaultValue="">
                  <option value="" disabled>
                    Selecciona
                  </option>
                  <option value="Páramo">Quedarse en el páramo</option>
                  <option value="Hotel en Manaure">Hotel en Manaure</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
