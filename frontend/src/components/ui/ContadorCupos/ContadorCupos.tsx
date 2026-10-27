import Icon from '../../../../../shared/components/Icon';
import { getCapacity } from '../../../../../shared/utils/capacity';
import CuentaRegresiva from '../CuentaRegresiva';
import './ContadorCupos.css';

export default function ContadorCupos() {
  const { available, capacity, occupied, percentage } = getCapacity(0);

  return (
    <aside className="cupo-card reveal" aria-label="Cupos del evento">
      <div className="cupo-card__head">
        <span className="cupo-card__label">Cupos del evento</span>
        <span className="cupo-card__live">
          <i className="dot-live" /> Cupo limitado
        </span>
      </div>
      <div className="cupo-card__number">
        {available}
        <small>de {capacity} personas</small>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-label="Ocupación de los cupos"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={occupied}
      >
        <div className="bar__fill" style={{ width: percentage + '%' }} />
      </div>
      <div className="cupo-card__foot">
        <span>Capacidad del evento</span>
        <span>{capacity} personas</span>
      </div>
      <div className="cupo-card__note">
        <Icon name="info" />
        <span>
          El cupo se confirma cuando la organización valida el comprobante de inscripción.
        </span>
      </div>
      <CuentaRegresiva />
    </aside>
  );
}
