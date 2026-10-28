import { AVISO_HOJA_CONSENTIMIENTO } from '../../../data/reserva/formulario';
import { useTerminos } from '../../../hooks';

type Props = { companion: boolean; onOpen: () => void };

/** Aceptación de términos por persona. Sin las obligatorias, la reserva no se envía. */
export default function Terminos({ companion, onOpen }: Props) {
  const view = useTerminos(companion);

  return (
    <div className="terminos">
      <p className="terminos__intro">
        Antes de registrar, lee los{' '}
        <button type="button" className="conditions-link" onClick={onOpen}>
          términos y condiciones
        </button>
        : explican los riesgos de la actividad, las normas y cómo se usan los datos.
      </p>
      {view.casillas.map((casilla) => (
        <div className="toggle-line terms-toggle" key={casilla.name}>
          <div className="toggle-line__text">
            <strong>{casilla.titulo}</strong>
            <small>{casilla.texto}</small>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              name={casilla.name}
              required={casilla.obligatoria}
              aria-label={casilla.titulo}
            />
            <span className="switch__track" />
          </label>
        </div>
      ))}
      <p className="form-aviso">{AVISO_HOJA_CONSENTIMIENTO}</p>
    </div>
  );
}
