import Calendario from '../../../components/ui/Calendario';
import { precios } from '../../../../../shared/config';
import { formatMoney } from '../../../../../shared/utils/format';
import type { PagoKitAcompanante } from '../../../types/reserva';
import CamposPersona from './CamposPersona';
import FichaSalud from './FichaSalud';

type Props = {
  companion: boolean;
  onCompanion: (value: boolean) => void;
  kit: boolean;
  onKit: (value: boolean) => void;
  pago: PagoKitAcompanante;
  onPago: (value: PagoKitAcompanante) => void;
  date: string;
  onDate: (value: string) => void;
};

const saldoKit = precios.acompananteConKit - precios.acompanante;

export default function Acompanante({
  companion,
  onCompanion,
  kit,
  onKit,
  pago,
  onPago,
  date,
  onDate,
}: Props) {
  const kitOptions = [
    { value: false, title: 'No', text: 'Sin kit, no se pide talla.' },
    {
      value: true,
      title: 'Sí',
      text: 'Valor total ' + formatMoney(precios.acompananteConKit) + '.',
    },
  ];
  const payOptions = [
    {
      value: 'inmediato' as const,
      title: 'Pago inmediato',
      text: formatMoney(precios.acompananteConKit) + ' ahora.',
    },
    {
      value: 'diferido' as const,
      title: 'Pago diferido',
      text:
        formatMoney(precios.acompanante) +
        ' ahora y ' +
        formatMoney(saldoKit) +
        ' en la fecha que elijas (reparto provisional).',
    },
  ];

  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">6</span>
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
          {kit && (
            <div className="field field--full">
              <span className="field__label" id="acompPago-label">
                Pago del kit del acompañante <span className="req">*</span>
              </span>
              <div className="choice-grid" role="radiogroup" aria-labelledby="acompPago-label">
                {payOptions.map((option) => (
                  <label className="choice" key={option.value}>
                    <input
                      type="radio"
                      name="acompPago"
                      value={option.value}
                      required
                      checked={pago === option.value}
                      onChange={() => onPago(option.value)}
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
          )}
          {kit && pago === 'diferido' && (
            <div className="field field--full">
              <Calendario
                selected={date}
                onSelect={onDate}
                concepto="el saldo del kit del acompañante"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
