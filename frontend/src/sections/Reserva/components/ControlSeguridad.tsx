import { AVISO_MENOR } from '../../../data/reserva/formulario';
import DatosSeguridad from './DatosSeguridad';

/** EPS, contacto de emergencia, salud y compromisos del participante (bloque 2). */
export default function ControlSeguridad({ esMenor }: { esMenor: boolean }) {
  return (
    <div className="form-block">
      <div className="form-block__head">
        <span className="form-block__n">2</span>
        <div>
          <h3>Control de seguridad</h3>
          <small>Salud, EPS y contacto de emergencia del participante.</small>
        </div>
      </div>
      {esMenor && (
        <p className="form-aviso" role="status">
          {AVISO_MENOR}
        </p>
      )}
      <div className="fields">
        <DatosSeguridad responsable={esMenor} />
      </div>
    </div>
  );
}
